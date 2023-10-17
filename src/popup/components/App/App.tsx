import { createElement } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import Navigation from '../Navigation';
import { StorageKeys, useStorageValue } from 'shared/storage';
import views from 'popup/views';

export function App() {
  const [tab, setTab] = useStorageValue(StorageKeys.POPUP_TAB);

  if (tab === null) {
    return null;
  }

  return (
    <Box sx={{ width: 300, height: 400 }}>
      <Paper square sx={{ p: 3, height: '100%' }}>
        <Typography
          variant="h5"
          sx={{ opacity: 0.67, fontWeight: 'bold', mb: 2 }}
        >
          {views[tab].title}
        </Typography>
        {createElement(views[tab].component)}
      </Paper>
      <Navigation tab={tab} onChange={setTab} />
    </Box>
  );
}
