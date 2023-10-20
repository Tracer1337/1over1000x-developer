import { useState, useEffect } from 'react';
import { CaptureFormat, Module } from './types';

export enum StorageKeys {
  SETTINGS = 'settings',
  POPUP_TAB = 'popup_tab',
  TAB_GROUPS = 'tab_groups',
  USER_STORY = 'user_story',
  FORMS = 'forms',
}

export type Settings = {
  chatGPTApiKey: string | null;
  captureFormat: CaptureFormat;
  captureFramerate: number;
  modules: Record<
    Module,
    {
      enabled: boolean;
      hosts: string[];
    }
  >;
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

export type Storage = {
  [StorageKeys.SETTINGS]: Settings;
  [StorageKeys.USER_STORY]: UserStory;
  [StorageKeys.TAB_GROUPS]: TabGroup[];
  [StorageKeys.POPUP_TAB]: number;
  [StorageKeys.FORMS]: SavedForm[];
};

export async function loadStorageValue<Key extends StorageKeys>(
  key: Key,
): Promise<Storage[Key] | null> {
  const json = (await chrome.storage.local.get(key))[key];
  return json ? JSON.parse(json) : null;
}

export async function saveStorageValue<Key extends StorageKeys>(
  key: Key,
  value: Storage[Key] | null,
) {
  await chrome.storage.local.set({
    [key]: JSON.stringify(value),
  });
}

export function addStorageValueListener<Key extends StorageKeys>(
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

export function useStorageValue<Key extends StorageKeys>(key: Key) {
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
