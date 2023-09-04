import { Button } from '@mui/material';
import { useStartScreenCapture } from './hooks/useStartScreenCapture';

export function ScreenCaptureButton() {
  const startScreenCapture = useStartScreenCapture();

  return (
    <Button variant="contained" onClick={startScreenCapture}>
      Start Recording
    </Button>
  );
}
