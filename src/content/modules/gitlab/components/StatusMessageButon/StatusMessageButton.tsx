import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useStatusMessage } from './hooks/useStatusMessage';

export function StatusMessageButton() {
  const [success, setSuccess] = useState(false);

  const copyStatusMessage = useStatusMessage();

  return (
    <>
      <button
        role="menuitem"
        type="button"
        className="dropdown-item"
        onClick={() => copyStatusMessage().then(() => setSuccess(true))}
      >
        <div className="gl-dropdown-item-text-wrapper">
          <p className="gl-dropdown-item-text-primary">Copy status message</p>
        </div>
      </button>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
          elevation={6}
        >
          Message copied
        </Alert>
      </Snackbar>
    </>
  );
}
