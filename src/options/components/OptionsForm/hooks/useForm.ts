import { ChangeEventHandler, FormEvent, useEffect, useState } from 'react';
import { StorageKeys } from 'shared/storage';

export type OptionsForm = {
  chatGPTApiKey: string;
};

const loadOptionsForm = async (): Promise<OptionsForm> => {
  const storage = await chrome.storage.local.get([StorageKeys.CHATGPT_TOKEN]);
  return {
    chatGPTApiKey: storage[StorageKeys.CHATGPT_TOKEN] ?? '',
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
    keyof OptionsForm,
    { value: any; onChange: ChangeEventHandler<HTMLInputElement> }
  > = {
    chatGPTApiKey: {
      value: chatGPTApiKey,
      onChange: (event) => setChatGPTApiKey(event.currentTarget.value),
    },
  };

  const handleSubmit =
    (submit: (form: OptionsForm) => void) =>
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      submit({ chatGPTApiKey });
    };

  return {
    inputs,
    handleSubmit,
    isLoading,
  };
}
