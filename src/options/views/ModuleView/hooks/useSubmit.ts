import { loadSettings, saveSettings } from 'shared/settings';
import { useState } from 'react';
import { Module, moduleDefs } from 'shared/types';
import { produce } from 'immer';

export function useSubmit<K extends Module>(
  module: Extract<(typeof moduleDefs)[number], { key: K }>,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  const submit = async (config: any) => {
    setIsLoading(true);
    const settings = await loadSettings();
    await saveSettings(
      produce(settings, (draft) => {
        Object.assign(draft.modules[module.key].config as any, config);
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
