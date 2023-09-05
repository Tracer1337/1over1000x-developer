import { Box, Typography } from '@mui/material';
import CommandList from './components/CommandList';

export function CommandsView() {
  return (
    <>
      <Typography
        variant="h5"
        sx={{ opacity: 0.67, fontWeight: 'bold', mb: 1 }}
      >
        Commands
      </Typography>

      <Box sx={{ mx: -3 }}>
        <CommandList />
      </Box>
    </>
  );
}
