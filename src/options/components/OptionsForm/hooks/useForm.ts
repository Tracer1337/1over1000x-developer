import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { Settings, loadSettings } from 'shared/storage';

export type OptionsForm = Settings & {
  chatGPTApiKey: string;
};

const loadOptionsForm = async (): Promise<OptionsForm> => {
  const settings = await loadSettings();
  return {
    ...settings,
    chatGPTApiKey: settings.chatGPTApiKey ?? '',
  };
};

export function useOptionsForm() {
  const [isLoading, setIsLoading] = useState(false);

  const [chatGPTApiKey, setChatGPTApiKey] = useState('');

  useEffect(() => {
    setIsLoading(true);
    loadOptionsForm().then((form) => {
      setChatGPTApiKey(form.chatGPTApiKey);
      setIsLoading(false);
    });
  }, []);

  const inputs: Record<
    keyof Pick<OptionsForm, 'chatGPTApiKey'>,
    { value: any; onChange: ChangeEventHandler<HTMLInputElement> }
  > = {
    chatGPTApiKey: {
      value: chatGPTApiKey,
      onChange: (event) => setChatGPTApiKey(event.currentTarget.value),
    },
  };

  const handleSubmit =
    (submit: (form: OptionsForm) => void) =>
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const settings = await loadSettings();
      submit({ ...settings, chatGPTApiKey });
    };

  return {
    inputs,
    handleSubmit,
    isLoading,
  };
}
