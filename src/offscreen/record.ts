import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Event, sendExtensionMessage } from 'shared/bridge';
import { Settings, StorageKeys } from 'shared/storage';
import { CaptureFormat } from 'shared/types';

const CAPTURE_FRAMERATE = 15;
const CAPTURE_RESOLUTION = 1080;

let recorder: MediaRecorder | null;
let data: Blob[] = [];
let startTime: number;
let endTime: number;

const videoFormatters: Record<CaptureFormat, (video: Blob) => Promise<string>> =
  {
    webm: convertToWebm,
    gif: convertToGIF,
  };

export async function startRecording({
  streamId,
  settings,
}: Extract<Event, { type: 'capture.start-recording' }>['data']) {
  if (recorder) {
    throw new Error('Recorder is already running');
  }

  const media = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      // @ts-ignore
      mandatory: {
        chromeMediaSource: 'tab',
        chromeMediaSourceId: streamId,
        ...(settings.captureFormat === 'gif'
          ? {
              maxFrameRate: CAPTURE_FRAMERATE,
              minFrameRate: CAPTURE_FRAMERATE,
            }
          : {}),
      },
    },
  });

  recorder = new MediaRecorder(media, { mimeType: 'video/webm' });

  recorder.addEventListener('dataavailable', (event) => {
    data.push(event.data);
  });

  recorder.addEventListener('stop', () => {
    const blob = new Blob(data, { type: 'video/webm' });
    processVideo(blob, settings);
    data = [];
  });

  recorder.start();

  startTime = performance.now();
}

export async function stopRecording() {
  if (!recorder) {
    return;
  }
  recorder.stop();
  recorder.stream.getTracks().forEach((track) => track.stop());
  recorder = null;
  endTime = performance.now();
}

async function processVideo(video: Blob, settings: Settings) {
  sendExtensionMessage('storage.save', {
    [StorageKeys.CAPTURE]: { state: 'loading' },
  });
  const url = await videoFormatters[settings.captureFormat](video);
  sendExtensionMessage('capture.transmit-recording', { url });
}

async function convertToWebm(video: Blob) {
  return URL.createObjectURL(new Blob([video], { type: 'video/webm' }));
}

async function convertToGIF(video: Blob) {
  return new Promise<string>(async (resolve) => {
    const {
      frames,
      dimensions: { width, height },
    } = await extractFrames(video);

    const gif = new GifEncoder({ width, height });

    gif.once('finished', (blob) => {
      resolve(URL.createObjectURL(blob));
    });

    for (let i = 0; i < frames.length; i++) {
      gif.addFrame(frames[i], 1000 / CAPTURE_FRAMERATE);
    }

    gif.render();
  });
}

async function extractFrames(video: Blob) {
  const dimensions = await getVideoDimensions(video);

  const ffmpeg = await setupFFmpeg(video);
  await ffmpeg.exec([
    '-i',
    'input.webm',
    '-vf',
    `scale=-1:${dimensions.height}`,
    '-r',
    CAPTURE_FRAMERATE.toString(),
    '-f',
    'image2',
    'output_%03d.png',
  ]);

  const images: Blob[] = [];
  let index = 1;

  while (true) {
    try {
      const filename = `output_${index.toString().padStart(3, '0')}.png`;
      const frameData = await ffmpeg.readFile(filename);
      images.push(new Blob([frameData], { type: 'image/png' }));
      index++;
    } catch (e) {
      break;
    }
  }

  const frames: ImageData[] = [];
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  for (let image of images) {
    ctx.drawImage(await createImageBitmap(image), 0, 0);
    frames.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  }

  return { frames, dimensions };
}

async function setupFFmpeg(video: Blob) {
  const ffmpeg = new FFmpeg();
  ffmpeg.on('log', (event) => console.log(event.type, event.message));
  await ffmpeg.load({
    coreURL: 'ffmpeg-core.js',
    wasmURL: 'ffmpeg-core.wasm',
  });
  await ffmpeg.writeFile('input.webm', await fetchFile(video));
  return ffmpeg;
}

function getVideoDimensions(video: Blob) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const element = document.createElement('video');
    element.src = URL.createObjectURL(video);
    element.addEventListener('loadedmetadata', () => {
      const aspectRatio = element.videoWidth / element.videoHeight;
      const width = Math.min(
        element.videoWidth,
        CAPTURE_RESOLUTION * aspectRatio,
      );
      const height = Math.min(element.videoHeight, CAPTURE_RESOLUTION);
      resolve({ width, height });
      URL.revokeObjectURL(element.src);
    });
  });
}
