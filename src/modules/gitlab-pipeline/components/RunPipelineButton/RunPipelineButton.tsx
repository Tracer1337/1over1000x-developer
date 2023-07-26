import { useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useCurrentRef } from '../CurrentRef/hooks/useCurrentRef';
import { useRunPipeline } from './hooks/useRunPipeline';

function RunPipelineButton() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const currentRef = useCurrentRef();
  const { isLoading, runPipeline } = useRunPipeline({
    ref: currentRef,
    onSuccess: () => setSuccess(true),
    onError: () => setError(true),
  });

  return (
    <>
      <LoadingButton
        onClick={runPipeline}
        loading={isLoading}
        variant="outlined"
        size="small"
      >
        Run Pipeline
      </LoadingButton>
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
          Pipeline started successfully
        </Alert>
      </Snackbar>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
      >
        <Alert
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
          elevation={6}
        >
          Could not start a pipeline
        </Alert>
      </Snackbar>
    </>
  );
}

export default RunPipelineButton;
