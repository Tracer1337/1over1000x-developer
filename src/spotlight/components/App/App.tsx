import { Box } from '@mui/material';
import Spotlight from '../Spotlight';

export function App() {
  return (
    <Box sx={{ m: 4 }}>
      <Spotlight onClose={() => window.close()} />
    </Box>
  );
}
