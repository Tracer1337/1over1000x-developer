import { Switch, Route, Redirect, Router } from 'wouter';
import { Container, Box, Stack } from '@mui/material';
import { useHashLocation } from 'shared/dom';
import Header from '../Header';
import Navigation from '../Navigation';
import ViewRenderer from '../ViewRenderer';

export function App() {
  return (
    <>
      <Box sx={{ mt: 4, mb: 6 }}>
        <Header />
      </Box>
      <Stack direction="row" justifyContent="center">
        <Navigation />
        <Container maxWidth="sm" sx={{ mx: 8 }}>
          <Box sx={{ mb: 4 }}>
            <Router base="/options.html" hook={useHashLocation}>
              <Switch>
                <Route path="/:path">
                  <ViewRenderer />
                </Route>
                <Route>
                  <Redirect to="/general" />
                </Route>
              </Switch>
            </Router>
          </Box>
        </Container>
        <Box sx={{ visibility: 'hidden' }}>
          <Navigation />
        </Box>
      </Stack>
    </>
  );
}
