import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { sendExtensionMessage } from 'shared/bridge';
import App from './components/App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ConfirmProvider } from 'material-ui-confirm';

handleIconClick();

const container = document.getElementById('root');
if (!container) {
  throw new Error('Could not find root container');
}

const root = createRoot(container);
root.render(
  <CssBaseline>
    <ConfirmProvider defaultOptions={{ title: 'Confirm' }}>
      <App />
    </ConfirmProvider>
  </CssBaseline>,
);

function handleIconClick() {
  sendExtensionMessage('capture.stop');
}
