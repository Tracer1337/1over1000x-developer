import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import App from './components/App';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Could not find root container');
}

const root = createRoot(container);
root.render(
  <CssBaseline>
    <App />
  </CssBaseline>,
);
