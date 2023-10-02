import { LoadingButton } from '@mui/lab';
import {
  Alert,
  CircularProgress,
  Snackbar,
  Stack,
  TextField,
} from '@mui/material';
import { useSubmit } from './hooks/useSubmit';
import { useGeneralForm } from './hooks/useForm';

export function GeneralView() {
  const { inputs, handleSubmit, isLoading } = useGeneralForm();
  const { submit, isLoading: isSubmitting, snackbar } = useSubmit();

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack component="form" onSubmit={handleSubmit(submit)} gap={2}>
      <TextField
        {...inputs.chatGPTApiKey}
        label="ChatGPT API Key"
        fullWidth
        type="password"
      />
      <LoadingButton
        variant="outlined"
        fullWidth
        type="submit"
        loading={isSubmitting}
      >
        Save
      </LoadingButton>
      <Snackbar
        {...snackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={snackbar.onClose}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          Settings saved
        </Alert>
      </Snackbar>
    </Stack>
  );
}
