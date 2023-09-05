import { FFmpeg } from '@ffmpeg/ffmpeg';
import { ProgressEvent } from '@ffmpeg/ffmpeg/dist/esm/types';
import { fetchFile } from '@ffmpeg/util';
import { Event, senderId } from 'shared/bridge';
import { Settings } from 'shared/storage';
import { CaptureFormat } from 'shared/types';

let recorder: MediaRecorder | null;
let data: Blob[] = [];

const videoFormatters: Record<CaptureFormat, (video: Blob) => Promise<string>> =
  {
    webm: convertToWebm,
    mp4: convertToMP4,
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
}

export async function stopRecording() {
  if (!recorder) {
    return;
  }
  recorder.stop();
  recorder.stream.getTracks().forEach((track) => track.stop());
  recorder = null;
}

async function processVideo(video: Blob, settings: Settings) {
  const url = await videoFormatters[settings.captureFormat](video);
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

async function convertToMP4(video: Blob) {
  const ffmpeg = await setupFFmpeg(video);
  await ffmpeg.exec(['-i', 'input.webm', 'output.mp4']);
  const output = await ffmpeg.readFile('output.mp4');
  return URL.createObjectURL(new Blob([output], { type: 'video/mp4' }));
}

async function convertToGIF(video: Blob) {
  const ffmpeg = await setupFFmpeg(video);
  await ffmpeg.exec(['-i', 'input.webm', 'output.gif']);
  const output = await ffmpeg.readFile('output.gif');
  return URL.createObjectURL(new Blob([output], { type: 'image/gif' }));
}

async function setupFFmpeg(video: Blob) {
  const ffmpeg = new FFmpeg();
  ffmpeg.on('progress', handleProgress);
  await ffmpeg.load({
    coreURL: 'ffmpeg-core.js',
    wasmURL: 'ffmpeg-core.wasm',
  });
  await ffmpeg.writeFile('input.webm', await fetchFile(video));
  return ffmpeg;
}

function handleProgress({ progress }: ProgressEvent) {
  const event: Event = {
    senderId,
    type: 'capture.process',
    data: { progress },
  };
  chrome.runtime.sendMessage(event);
}
