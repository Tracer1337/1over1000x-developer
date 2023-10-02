import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { loadSettings } from 'shared/settings';

export type GeneralForm = {
  chatGPTApiKey: string;
};

const loadGeneralForm = async (): Promise<GeneralForm> => {
  const settings = await loadSettings();
  return {
    chatGPTApiKey: settings.chatGPTApiKey ?? '',
  };
};

export function useGeneralForm() {
  const [isLoading, setIsLoading] = useState(false);

  const [chatGPTApiKey, setChatGPTApiKey] = useState('');

  useEffect(() => {
    setIsLoading(true);
    loadGeneralForm().then((form) => {
      setChatGPTApiKey(form.chatGPTApiKey);
      setIsLoading(false);
    });
  }, []);

  const inputs: Record<
    keyof GeneralForm,
    { value: any; onChange: ChangeEventHandler<HTMLInputElement> }
  > = {
    chatGPTApiKey: {
      value: chatGPTApiKey,
      onChange: (event) => setChatGPTApiKey(event.currentTarget.value),
    },
  };

  const handleSubmit =
    (submit: (form: GeneralForm) => void) =>
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit({ chatGPTApiKey });
    };

  return {
    inputs,
    handleSubmit,
    isLoading,
  };
}
