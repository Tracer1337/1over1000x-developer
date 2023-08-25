import { Typography, Fade } from '@mui/material';
import { useScreenCaptureProcess } from './hooks/useScreenCaptureProcess';

export function ScreenCaptureProcess() {
  const progress = useScreenCaptureProcess();

  return (
    <Fade in={progress < 1}>
      <Typography>Processing... ({Math.floor(progress * 100)}%)</Typography>
    </Fade>
  );
}
