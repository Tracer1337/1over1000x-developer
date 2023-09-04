import { FFmpeg } from '@ffmpeg/ffmpeg';
import { ProgressEvent } from '@ffmpeg/ffmpeg/dist/esm/types';
import { fetchFile } from '@ffmpeg/util';
import { Event, senderId } from 'shared/bridge';

let recorder: MediaRecorder | null;
let data: Blob[] = [];

export async function startRecording(streamId: string) {
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
    processVideo(blob);
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

async function processVideo(video: Blob) {
  const ffmpeg = new FFmpeg();
  ffmpeg.on('progress', handleProgress);
  await ffmpeg.load({
    coreURL: 'ffmpeg-core.js',
    wasmURL: 'ffmpeg-core.wasm',
  });
  await ffmpeg.writeFile('input.webm', await fetchFile(video));
  await ffmpeg.exec(['-i', 'input.webm', 'output.gif']);
  const output = await ffmpeg.readFile('output.gif');
  const url = URL.createObjectURL(new Blob([output], { type: 'image/gif' }));
  const event: Event = {
    senderId,
    type: 'capture.transmit-recording',
    data: { url },
  };
  chrome.runtime.sendMessage(event);
}

function handleProgress({ progress }: ProgressEvent) {
  const event: Event = {
    senderId,
    type: 'capture.process',
    data: { progress },
  };
  chrome.runtime.sendMessage(event);
}
