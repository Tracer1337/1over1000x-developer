import { Switch, Route } from 'wouter';
import { Box, Paper } from '@mui/material';
import { useSavedLocation } from 'shared/dom';
import { StorageKeys } from 'shared/storage';
import Navigation from '../Navigation';
import ViewRenderer from '../ViewRenderer';

export function App() {
  useSavedLocation(StorageKeys.POPUP_LOCATION).goToSavedLocation();

  return (
    <Box sx={{ width: 300, height: 400 }}>
      <Paper square sx={{ height: '100%' }}>
        <Switch>
          <Route path="/:path">
            <Box sx={{ p: 3 }}>
              <ViewRenderer />
            </Box>
          </Route>
          <Route>
            <Box sx={{ pt: 1 }}>
              <Navigation />
            </Box>
          </Route>
        </Switch>
      </Paper>
    </Box>
  );
}
