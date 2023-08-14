import { OptionsForm } from './useForm';
import { useState } from 'react';
import { StorageKeys } from 'shared/storage';

export function useSubmit() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const submit = (form: OptionsForm) => {
    setIsLoading(true);
    chrome.storage.local.set({
      [StorageKeys.CHATGPT_TOKEN]: form.chatGPTApiKey,
    });
    setIsSnackbarOpen(true);
    setIsLoading(false);
  };

  const snackbar = {
    open: isSnackbarOpen,
    onClose: () => setIsSnackbarOpen(false),
  };

  return { submit, isLoading, snackbar };
}
