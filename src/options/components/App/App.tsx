import React, { useState } from 'react';
import { Container, Box, Stack } from '@mui/material';
import Header from '../Header';
import Navigation from '../Navigation';
import views from 'options/views';

export function App() {
  const [view, setView] = useState(0);

  return (
    <>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Header />
      </Box>
      <Stack direction="row" justifyContent="center">
        <Navigation value={view} onChange={setView} />
        <Container maxWidth="sm" sx={{ mx: 8 }}>
          <Box sx={{ mb: 4 }}>{React.createElement(views[view].component)}</Box>
        </Container>
        <Box sx={{ visibility: 'hidden' }}>
          <Navigation value={view} onChange={setView} />
        </Box>
      </Stack>
    </>
  );
}
