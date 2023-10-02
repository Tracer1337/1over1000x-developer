import { loadSettings, saveSettings } from 'shared/settings';
import { GeneralForm } from './useForm';
import { useState } from 'react';

export function useSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const submit = async (form: GeneralForm) => {
    setIsLoading(true);
    const settings = await loadSettings();
    await saveSettings({ ...settings, ...form });
    setIsSnackbarOpen(true);
    setIsLoading(false);
  };

  const snackbar = {
    open: isSnackbarOpen,
    onClose: () => setIsSnackbarOpen(false),
  };

  return { submit, isLoading, snackbar };
}
