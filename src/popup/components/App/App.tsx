import { createElement, useEffect, useState } from 'react';
import { Box, Paper, Stack, Typography } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Navigation from '../Navigation';
import { StorageKeys, useStorageValue } from 'shared/storage';
import views from 'popup/views';

export function App() {
  const [savedTab, setSavedTab] = useStorageValue(StorageKeys.POPUP_TAB);
  const [tab, setTab] = useState<number | null>(null);

  useEffect(() => {
    if (savedTab !== null) {
      setTab(savedTab);
    }
  }, [savedTab]);

  if (tab === null) {
    return (
      <Box sx={{ width: 300, height: 400 }}>
        <Paper square sx={{ pt: 1, height: '100%' }}>
          <Navigation onChange={setTab} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 300, height: 400 }}>
      <Paper square sx={{ p: 3, height: '100%' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ opacity: 0.67, mb: 2 }}
        >
          <Stack direction="row" alignItems="center">
            <Box
              sx={{ cursor: 'pointer', display: 'flex', mr: 2 }}
              onClick={() => setTab(null)}
            >
              <ChevronLeftIcon />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {views[tab].title}
            </Typography>
          </Stack>
          <Box
            sx={{ cursor: 'pointer', display: 'flex' }}
            onClick={() => setSavedTab(savedTab === tab ? null : tab)}
          >
            <PushPinIcon
              color={savedTab === tab ? 'secondary' : 'inherit'}
              fontSize="small"
            />
          </Box>
        </Stack>
        {createElement(views[tab].component)}
      </Paper>
    </Box>
  );
}
