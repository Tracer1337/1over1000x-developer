import { ButtonGroup, Box } from '@mui/material';
import ScreenCaptureButton from '../ScreenCaptureButton';
import ScreenCaptureProcess from '../ScreenCaptureProcess';

export function App() {
  return (
    <Box sx={{ p: 1, width: 200 }}>
      <ScreenCaptureProcess />
      <ButtonGroup size="small" variant="outlined">
        <ScreenCaptureButton />
      </ButtonGroup>
    </Box>
  );
}
