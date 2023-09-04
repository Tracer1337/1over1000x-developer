import { FormControlLabel, Switch } from '@mui/material';
import { useSettings } from './hooks/useSettings';

export function ScreenCaptureGifSwitch() {
  const [settings, setSettings] = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <FormControlLabel
      control={
        <Switch
          checked={settings.recordGif}
          onChange={(event) =>
            setSettings({
              ...settings,
              recordGif: event.target.checked,
            })
          }
        />
      }
      label="Record as GIF"
    />
  );
}
