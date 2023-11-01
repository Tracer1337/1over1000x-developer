import { Box, Fade, LinearProgress, Typography } from '@mui/material';
import { captureFormatDefs } from 'shared/types';
import { useSettings } from 'shared/settings';
import { StorageKeys, useStorageValue } from 'shared/storage';

export function ScreenCaptureProcess() {
  const [settings] = useSettings();
  const [capture] = useStorageValue(StorageKeys.CAPTURE);

  if (!settings) {
    return null;
  }

  const formatLabel = captureFormatDefs.find(
    (format) => format.key === settings.captureFormat,
  )?.label;

  return (
    <Fade in={capture?.state === 'loading'}>
      <Box>
        <Typography variant="subtitle2">Converting to {formatLabel}</Typography>
        <LinearProgress />
      </Box>
    </Fade>
  );
}
