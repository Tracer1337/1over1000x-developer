import { useState, useEffect } from 'react';
import { CaptureFormat, ModuleConfig, moduleDefs } from './types';

export enum StorageKeys {
  SETTINGS = 'settings',
  POPUP_LOCATION = 'popup_location',
  TAB_GROUPS = 'tab_groups',
  USER_STORY = 'user_story',
  FORMS = 'forms',
  CAPTURE = 'capture',
}

export type Settings = {
  chatGPTApiKey: string | null;
  captureFormat: CaptureFormat;
  modules: {
    [K in (typeof moduleDefs)[number]['key']]: ModuleConfig<K>;
  };
};

export type TabGroup = {
  name: string;
  tabs: { url: string }[];
};

export type SavedForm = {
  label: string;
  host: string;
  values: string[];
};

export type UserStory = {
  loading: boolean;
  data: {
    title: string;
    description: string;
    criteria: string[];
  } | null;
};

export interface Storage {
  [StorageKeys.SETTINGS]: Settings;
  [StorageKeys.USER_STORY]: UserStory;
  [StorageKeys.TAB_GROUPS]: TabGroup[];
  [StorageKeys.POPUP_LOCATION]: string;
  [StorageKeys.FORMS]: SavedForm[];
  [StorageKeys.CAPTURE]: {
    state: 'idle' | 'running' | 'loading';
  };
}

export async function loadStorageValue<Key extends keyof Storage>(
  key: Key,
): Promise<Storage[Key] | null> {
  const json = (await chrome.storage.local.get(key))[key];
  return json ? JSON.parse(json) : null;
}

export async function saveStorageValue<Key extends keyof Storage>(
  key: Key,
  value: Storage[Key] | null,
) {
  await chrome.storage.local.set({
    [key]: JSON.stringify(value),
  });
}

export function addStorageValueListener<Key extends keyof Storage>(
  key: Key,
  callback: (value: Storage[Key]) => void,
) {
  const handleStorageChange = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    if (!(key in changes)) {
      return;
    }
    callback(JSON.parse(changes[key].newValue));
  };
  chrome.storage.local.onChanged.addListener(handleStorageChange);
  return () => {
    chrome.storage.local.onChanged.removeListener(handleStorageChange);
  };
}

export function useStorageValue<Key extends keyof Storage>(key: Key) {
  const [value, setValue] = useState<Storage[Key] | null>(null);

  useEffect(() => {
    loadStorageValue(key).then(setValue);
    return addStorageValueListener(key, setValue);
  }, []);

  const updateValue = (newValue: Storage[Key] | null) => {
    saveStorageValue(key, newValue).then(() => setValue(newValue));
  };

  return [value, updateValue] as const;
}
