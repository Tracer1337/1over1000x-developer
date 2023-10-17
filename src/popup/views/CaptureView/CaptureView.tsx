import { Stack } from '@mui/material';
import ScreenCaptureFormatInput from './components/ScreenCaptureFormatInput';
import ScreenCaptureButton from './components/ScreenCaptureButton';
import ScreenCaptureProcess from './components/ScreenCaptureProcess';
import ScreenCaptureFramerateInput from './components/ScreenCaptureFramerateInput';

export function CaptureView() {
  return (
    <Stack gap={1} sx={{ mt: 1 }}>
      <ScreenCaptureFormatInput />
      <ScreenCaptureFramerateInput />
      <ScreenCaptureButton />
      <ScreenCaptureProcess />
    </Stack>
  );
}
