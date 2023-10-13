import { Typography, Stack } from '@mui/material';
import ScreenCaptureFormatInput from './components/ScreenCaptureFormatInput';
import ScreenCaptureButton from './components/ScreenCaptureButton';
import ScreenCaptureProcess from './components/ScreenCaptureProcess';
import ScreenCaptureFramerateInput from './components/ScreenCaptureFramerateInput';

export function CaptureView() {
  return (
    <>
      <Typography
        variant="h5"
        sx={{ opacity: 0.67, fontWeight: 'bold', mb: 2 }}
      >
        Tab Capture
      </Typography>
      <Stack gap={1}>
        <ScreenCaptureFormatInput />
        <ScreenCaptureFramerateInput />
        <ScreenCaptureButton />
        <ScreenCaptureProcess />
      </Stack>
    </>
  );
}
