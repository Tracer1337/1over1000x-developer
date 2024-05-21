import {
  Event,
  getCurrentTab,
  resetIcon,
  sendExtensionMessage,
} from 'shared/bridge';
import { loadSettings } from 'shared/settings';
import { Storage, StorageKeys, saveStorageValue } from 'shared/storage';

export let stopScreenCapture: (() => void) | null = null;
export let transmitScreenCapture:
  | ((url: Extract<Event, { type: 'capture.transmit-recording' }>) => void)
  | null = null;

export async function startScreenCapture() {
  assertNoRunningScreenCapture();
  assertNoOffscreenDocument();

  await saveStorageValue(StorageKeys.CAPTURE, { state: 'running' });

  const videoUrl = await runScreenCapture();

  await downloadScreenCapture(videoUrl);

  await saveStorageValue(StorageKeys.CAPTURE, { state: 'idle' });
}

let destroyLoadingAnimation: (() => void) | null = null;

export async function handleCaptureValueChange(
  value: Storage[StorageKeys.CAPTURE],
) {
  destroyLoadingAnimation?.();
  destroyLoadingAnimation = null;

  if (value.state === 'running') {
    await chrome.action.setIcon({ path: '/assets/stop-icon.png' });
  }

  if (value.state === 'loading') {
    destroyLoadingAnimation = startLoadingAnimation();
  }

  if (value.state === 'idle') {
    await resetIcon();
    await chrome.offscreen.closeDocument();
  }
}

async function runScreenCapture() {
  const tab = await getCurrentTab();

  if (!tab.id) {
    throw new Error('Tab id is not set');
  }

  const streamId = await new Promise<string>((resolve) =>
    chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, resolve),
  );

  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: [
      chrome.offscreen.Reason.USER_MEDIA,
      chrome.offscreen.Reason.BLOBS,
      chrome.offscreen.Reason.WORKERS,
    ],
    justification: 'Recording from chrome.tabCapture API',
  });

  sendExtensionMessage('capture.start-recording', {
    streamId,
    settings: await loadSettings(),
  });

  const stopTimer = startTimer();

  const [videoUrl] = await Promise.all([
    new Promise<string>((resolve) => {
      transmitScreenCapture = (event) => {
        resolve(event.data.url);
        transmitScreenCapture = null;
      };
    }),
    new Promise<void>((resolve) => {
      stopScreenCapture = () => {
        sendExtensionMessage('capture.stop-recording');
        resolve();
        stopTimer();
        stopScreenCapture = null;
      };
    }),
  ]);

  return videoUrl;
}

async function downloadScreenCapture(gifUrl: string) {
  const settings = await loadSettings();
  await chrome.downloads.download({
    url: gifUrl,
    filename: `recording.${settings.captureFormat}`,
  });
}

function startTimer() {
  let startTime = Date.now();
  const interval = setInterval(
    () => updateActionTimer(Date.now() - startTime),
    50,
  );
  return () => {
    clearInterval(interval);
    clearActionTimer();
  };
}

async function updateActionTimer(time: number) {
  const seconds = Math.floor(time / 1000)
    .toString()
    .padStart(2, '0');
  const centiseconds = Math.floor((time % 1000) / 10)
    .toString()
    .padEnd(2, '0');
  await chrome.action.setBadgeText({ text: `${seconds}:${centiseconds}` });
}

async function clearActionTimer() {
  await chrome.action.setBadgeText({ text: '' });
}

function startLoadingAnimation() {
  const getFramePath = (i: number) =>
    `/assets/loading-animation/tile${i.toString().padStart(3, '0')}.png`;

  let isRunning = true;
  let currentFrame = 0;

  const animate = () => {
    if (!isRunning) {
      return;
    }
    chrome.action.setIcon({
      path: getFramePath(currentFrame++ % 12),
    });
    setTimeout(animate, 80);
  };

  animate();

  return () => {
    isRunning = false;
    resetIcon();
  };
}

async function assertNoRunningScreenCapture() {
  if (stopScreenCapture !== null) {
    throw new Error('Screen capture is already running');
  }
}

async function assertNoOffscreenDocument() {
  // @ts-ignore
  const existingContexts = await chrome.runtime.getContexts({});

  const offscreenDocument = existingContexts.find(
    (context: any) => context.contextType === 'OFFSCREEN_DOCUMENT',
  );

  if (offscreenDocument) {
    throw new Error('Offscreen Document already exists');
  }
}
