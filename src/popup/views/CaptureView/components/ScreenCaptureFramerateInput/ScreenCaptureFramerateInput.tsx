import { TextField } from '@mui/material';
import { useSettings } from 'shared/settings';

export function ScreenCaptureFramerateInput() {
  const [settings, setSettings] = useSettings();

  if (!settings || settings.captureFormat !== 'gif') {
    return null;
  }

  return (
    <TextField
      label="Capture Framerate"
      variant="outlined"
      value={settings.captureFramerate}
      size="small"
      fullWidth
      onChange={(event) =>
        setSettings({
          ...settings,
          captureFramerate: parseInt(event.target.value) || 0,
        })
      }
      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
    />
  );
}
