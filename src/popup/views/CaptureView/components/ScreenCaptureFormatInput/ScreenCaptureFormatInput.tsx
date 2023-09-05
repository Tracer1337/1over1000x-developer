import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useSettings } from 'shared/storage';
import { CaptureFormat, captureFormatDefs } from 'shared/types';

const disabled: CaptureFormat[] = ['mp4'];

export function ScreenCaptureFormatInput() {
  const [settings, setSettings] = useSettings();

  if (!settings) {
    return null;
  }

  return (
    <FormControl size="small">
      <InputLabel>Video Format</InputLabel>
      <Select
        label="Video Format"
        value={settings.captureFormat}
        onChange={(event) =>
          setSettings({
            ...settings,
            captureFormat: event.target.value as CaptureFormat,
          })
        }
      >
        {captureFormatDefs.map((format) => (
          <MenuItem
            value={format.key}
            key={format.key}
            disabled={disabled.includes(format.key)}
          >
            {format.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
