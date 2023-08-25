import { Event, resetIcon, senderId } from 'shared/bridge';

type Video = 0;

export let stopScreenCapture: (() => void) | null = null;

export async function startScreenCapture() {
  if (stopScreenCapture !== null) {
    throw new Error('Screen capture is already running');
  }

  await chrome.action.setIcon({ path: '/assets/stop-icon.png' });

  console.log('Start screen capture');

  const video = await runScreenCapture();

  console.log('End screen capture');

  await resetIcon();

  const gif = await processScreenCapture(video);

  downloadScreenCapture(gif);
}

async function runScreenCapture() {
  let isRecording = true;
  let duration = 0;

  stopScreenCapture = () => {
    isRecording = false;
  };

  while (isRecording) {
    await updateActionTimer(duration);
    duration += 500;
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  stopScreenCapture = null;

  clearActionTimer();

  return 0 as Video;
}

async function processScreenCapture(video: Video) {
  for (let i = 1; i <= 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log('Process screen capture', { video, i });
    const event: Event = {
      senderId,
      type: 'capture.process',
      data: {
        progress: i / 10,
      },
    };
    chrome.runtime.sendMessage(event);
  }
  return new Blob();
}

function downloadScreenCapture(gif: Blob) {
  console.log('Download screen capture', { gif });
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
