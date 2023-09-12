import { Box, Fade, LinearProgress, Typography } from '@mui/material';
import { useScreenCaptureProcess } from './hooks/useScreenCaptureProcess';
import { captureFormatDefs } from 'shared/types';
import { useSettings } from 'shared/settings';

export function ScreenCaptureProcess() {
  const [settings] = useSettings();
  const loading = useScreenCaptureProcess();

  if (!settings) {
    return null;
  }

  const formatLabel = captureFormatDefs.find(
    (format) => format.key === settings.captureFormat,
  )?.label;

  return (
    <Fade in={loading}>
      <Box>
        <Typography variant="subtitle2">Converting to {formatLabel}</Typography>
        <LinearProgress />
      </Box>
    </Fade>
  );
}
