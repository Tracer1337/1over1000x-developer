import { Typography, Stack } from '@mui/material';
import ScreenCaptureButton from './components/ScreenCaptureButton';
import ScreenCaptureGifSwitch from './components/ScreenCaptureGifSwitch';
import ScreenCaptureProcess from './components/ScreenCaptureProcess';

export function CaptureView() {
  return (
    <>
      <Typography
        variant="h5"
        sx={{ opacity: 0.67, fontWeight: 'bold', mb: 1 }}
      >
        Tab Capture
      </Typography>
      <Stack gap={1}>
        <ScreenCaptureGifSwitch />
        <ScreenCaptureButton />
        <ScreenCaptureProcess />
      </Stack>
    </>
  );
}
