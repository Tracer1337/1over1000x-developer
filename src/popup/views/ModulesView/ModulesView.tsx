import { Typography } from '@mui/material';
import { ModulePicker } from './components/ModulePicker/ModulePicker';

export function ModulesView() {
  return (
    <>
      <Typography
        variant="h5"
        sx={{ opacity: 0.67, fontWeight: 'bold', mb: 1 }}
      >
        Modules
      </Typography>
      <ModulePicker />
    </>
  );
}
