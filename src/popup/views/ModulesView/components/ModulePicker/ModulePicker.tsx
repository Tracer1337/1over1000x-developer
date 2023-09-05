import { FormControlLabel, Switch, Stack } from '@mui/material';
import { useModules } from './hooks/useModules';
import { moduleDefs } from 'shared/module';

export function ModulePicker() {
  const [modules, toggleModule] = useModules();

  if (!modules) {
    return;
  }

  return (
    <Stack>
      {moduleDefs.map(({ key, label }) => (
        <FormControlLabel
          control={
            <Switch checked={modules[key]} onChange={() => toggleModule(key)} />
          }
          label={label}
          key={key}
        />
      ))}
    </Stack>
  );
}
