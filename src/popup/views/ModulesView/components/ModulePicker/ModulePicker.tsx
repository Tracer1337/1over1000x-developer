import { FormControlLabel, Switch, Stack } from '@mui/material';
import { useModules } from './hooks/useModules';

export function ModulePicker() {
  const [modules, toggleModule] = useModules();

  if (!modules) {
    return;
  }

  return (
    <Stack>
      <FormControlLabel
        control={
          <Switch
            checked={modules.gitlab}
            onChange={() => toggleModule('gitlab')}
          />
        }
        label="GitLab"
      />
      <FormControlLabel
        control={
          <Switch
            checked={modules.spotlight}
            onChange={() => toggleModule('spotlight')}
          />
        }
        label="Spotlight"
      />
    </Stack>
  );
}
