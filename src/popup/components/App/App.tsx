import { ButtonGroup, Box } from '@mui/material';
import ScreenCaptureButton from '../ScreenCaptureButton';
import ScreenCaptureProcess from '../ScreenCaptureProcess';
import ScreenCaptureGifSwitch from '../ScreenCaptureGifSwitch';

export function App() {
  return (
    <Box sx={{ p: 1, width: 200 }}>
      <ScreenCaptureProcess />
      <ScreenCaptureGifSwitch />
      <ButtonGroup size="small" variant="outlined">
        <ScreenCaptureButton />
      </ButtonGroup>
    </Box>
  );
}
