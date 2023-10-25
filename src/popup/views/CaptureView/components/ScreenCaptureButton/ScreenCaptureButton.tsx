import { Button } from '@mui/material';
import { sendExtensionMessage } from 'shared/bridge';

export function ScreenCaptureButton() {
  return (
    <Button
      variant="contained"
      onClick={() => {
        sendExtensionMessage('capture.start');
        window.close();
      }}
    >
      Start Recording
    </Button>
  );
}
