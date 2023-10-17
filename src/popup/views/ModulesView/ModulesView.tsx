import { Box } from '@mui/material';
import { ModulePicker } from './components/ModulePicker/ModulePicker';

export function ModulesView() {
  return (
    <Box sx={{ mt: -2 }}>
      <ModulePicker />
    </Box>
  );
}
