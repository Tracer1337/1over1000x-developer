import { Container, Box } from '@mui/material';
import Header from '../Header';
import OptionsForm from '../OptionsForm';
import { Cache } from '../Cache/Cache';

export function App() {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Header />
      </Box>
      <Box sx={{ mb: 4 }}>
        <OptionsForm />
      </Box>
      <Cache />
    </Container>
  );
}
