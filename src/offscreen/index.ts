import { addExtensionListener } from 'shared/bridge';
import { startRecording, stopRecording } from './record';

addExtensionListener('capture.start-recording', (event) =>
  startRecording(event.data),
);
addExtensionListener('capture.stop-recording', stopRecording);
