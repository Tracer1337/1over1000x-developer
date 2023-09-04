import { isEvent } from 'shared/bridge';
import { startRecording, stopRecording } from './record';

chrome.runtime.onMessage.addListener(async (message) => {
  if (!isEvent(message)) {
    return;
  }

  switch (message.type) {
    case 'capture.start-recording':
      startRecording(message.data.streamId);
      break;
    case 'capture.stop-recording':
      stopRecording();
      break;
  }
});
