import { Button } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import { useStartScreenCapture } from './hooks/useStartScreenCapture';

export function ScreenCaptureButton() {
  const startScreenCapture = useStartScreenCapture();

  return (
    <Button onClick={startScreenCapture}>
      <CenterFocusWeakIcon />
    </Button>
  );
}
