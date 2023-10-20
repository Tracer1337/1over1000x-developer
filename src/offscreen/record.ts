import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { Event, senderId } from 'shared/bridge';
import { Settings } from 'shared/storage';
import { CaptureFormat } from 'shared/types';

let recorder: MediaRecorder | null;
let data: Blob[] = [];
let startTime: number;
let endTime: number;

const videoFormatters: Record<
  CaptureFormat,
  (video: Blob, settings: Settings) => Promise<string>
> = {
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
              maxFrameRate: settings.captureFramerate,
              minFrameRate: settings.captureFramerate,
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
  const url = await videoFormatters[settings.captureFormat](video, settings);
  emitProcessEvent(false);
  const event: Event = {
    senderId,
    type: 'capture.transmit-recording',
    data: { url },
  };
  chrome.runtime.sendMessage(event);
}

async function convertToWebm(video: Blob) {
  return URL.createObjectURL(new Blob([video], { type: 'video/webm' }));
}

async function convertToGIF(video: Blob, settings: Settings) {
  return new Promise<string>(async (resolve) => {
    const {
      frames,
      dimensions: { width, height },
    } = await extractFrames(video, settings);

    const gif = new GifEncoder({ width, height });

    gif.on('progress', () => emitProcessEvent(true));

    gif.once('finished', (blob) => {
      resolve(URL.createObjectURL(blob));
    });

    for (let i = 0; i < frames.length; i++) {
      gif.addFrame(frames[i], 1000 / settings.captureFramerate);
    }

    gif.render();
  });
}

async function extractFrames(video: Blob, settings: Settings) {
  const dimensions = await getVideoDimensions(video);

  const ffmpeg = await setupFFmpeg(video);
  await ffmpeg.exec([
    '-i',
    'input.webm',
    '-r',
    settings.captureFramerate.toString(),
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
  ffmpeg.on('progress', () => emitProcessEvent(true));
  ffmpeg.on('log', (event) => console.log(event.type, event.message));
  await ffmpeg.load({
    coreURL: 'ffmpeg-core.js',
    wasmURL: 'ffmpeg-core.wasm',
  });
  await ffmpeg.writeFile('input.webm', await fetchFile(video));
  return ffmpeg;
}

function emitProcessEvent(loading: boolean) {
  const event: Event = {
    senderId,
    type: 'capture.process',
    data: { loading },
  };
  chrome.runtime.sendMessage(event);
}

function getVideoDimensions(video: Blob) {
  return new Promise<{ width: number; height: number }>((resolve) => {
    const element = document.createElement('video');
    element.src = URL.createObjectURL(video);
    element.addEventListener('loadedmetadata', () => {
      resolve({ width: element.videoWidth, height: element.videoHeight });
      URL.revokeObjectURL(element.src);
    });
  });
}
