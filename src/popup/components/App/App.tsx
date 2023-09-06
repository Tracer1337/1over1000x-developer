import { createElement } from 'react';
import { Box, Paper } from '@mui/material';
import Navigation from '../Navigation';
import CaptureView from 'popup/views/CaptureView';
import TabView from 'popup/views/TabView';
import CommandsView from 'popup/views/CommandsView';
import ModulesView from 'popup/views/ModulesView';
import { useTab } from './hooks/useTab';

const views = [CaptureView, TabView, CommandsView, ModulesView];

export function App() {
  const [tab, setTab] = useTab();

  if (tab === null) {
    return null;
  }

  return (
    <Box sx={{ width: 300, height: 400 }}>
      <Paper square sx={{ p: 3, height: '100%' }}>
        {createElement(views[tab])}
      </Paper>
      <Navigation tab={tab} onChange={setTab} />
    </Box>
  );
}
