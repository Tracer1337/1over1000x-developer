import { Box } from '@mui/material';
import CommandList from './components/CommandList';

export function CommandsView() {
  return (
    <Box sx={{ mx: -3, mt: -2 }}>
      <CommandList />
    </Box>
  );
}
