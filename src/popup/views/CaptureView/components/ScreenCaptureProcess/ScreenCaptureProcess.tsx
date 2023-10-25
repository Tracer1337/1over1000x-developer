import { useEffect, useState } from 'react';
import { Box, Fade, LinearProgress, Typography } from '@mui/material';
import { captureFormatDefs } from 'shared/types';
import { useSettings } from 'shared/settings';
import { addExtensionListener } from 'shared/bridge';

export function ScreenCaptureProcess() {
  const [settings] = useSettings();
  const [loading, setLoading] = useState(false);

  useEffect(
    addExtensionListener('capture.process', (event) =>
      setLoading(event.data.loading),
    ),
  );

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
