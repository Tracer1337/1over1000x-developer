import { loadSettings, saveSettings } from 'shared/settings';
import { ModuleForm } from './useModuleForm';
import { useState } from 'react';
import { Module } from 'shared/types';
import { produce } from 'immer';

export function useSubmit(module: Module) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const submit = async (form: ModuleForm) => {
    setIsLoading(true);
    const settings = await loadSettings();
    await saveSettings(
      produce(settings, (draft) => {
        Object.assign(draft.modules[module], form);
      }),
    );
    setIsSnackbarOpen(true);
    setIsLoading(false);
  };

  const snackbar = {
    open: isSnackbarOpen,
    onClose: () => setIsSnackbarOpen(false),
  };

  return { submit, isLoading, snackbar };
}
