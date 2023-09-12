import { saveSettings } from 'shared/settings';
import { OptionsForm } from './useForm';
import { useState } from 'react';

export function useSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const submit = async (form: OptionsForm) => {
    setIsLoading(true);
    await saveSettings(form);
    setIsSnackbarOpen(true);
    setIsLoading(false);
  };

  const snackbar = {
    open: isSnackbarOpen,
    onClose: () => setIsSnackbarOpen(false),
  };

  return { submit, isLoading, snackbar };
}
