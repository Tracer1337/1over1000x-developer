import { useState, useEffect } from 'react';
import { CaptureFormat, Module, moduleDefs } from './types';

export enum StorageKeys {
  SETTINGS = 'settings',
  POPUP_TAB = 'popup_tab',
  TAB_GROUPS = 'tab_groups',
}

export type Settings = {
  chatGPTApiKey: string | null;
  captureFormat: CaptureFormat;
  modules: Record<Module, boolean>;
};

function getDefaultSettings(): Settings {
  return {
    chatGPTApiKey: null,
    captureFormat: 'webm',
    modules: Object.fromEntries(
      moduleDefs.map(({ key }) => [key, true]),
    ) as Settings['modules'],
  };
}

function createSettingsObject(values: { [key: string]: any }): Settings {
  if (!(values instanceof Object)) {
    throw new Error('Parameter is not an object');
  }
  const defaultSettings = getDefaultSettings();
  return {
    chatGPTApiKey: values.chatGPTApiKey ?? defaultSettings.chatGPTApiKey,
    captureFormat: values.captureFormat ?? defaultSettings.captureFormat,
    modules: Object.fromEntries(
      moduleDefs.map(({ key }) => [
        key,
        values.modules?.[key] ?? defaultSettings.modules[key],
      ]),
    ) as Settings['modules'],
  };
}

export async function loadSettings(): Promise<Settings> {
  const json = (await chrome.storage.local.get(StorageKeys.SETTINGS))[
    StorageKeys.SETTINGS
  ];
  return createSettingsObject(json ? JSON.parse(json) : {});
}

export async function saveSettings(settings: Settings) {
  await chrome.storage.local.set({
    [StorageKeys.SETTINGS]: JSON.stringify(createSettingsObject(settings)),
  });
}

export function addSettingsListener(callback: (settings: Settings) => void) {
  const handleStorageChange = (changes: {
    [key: string]: chrome.storage.StorageChange;
  }) => {
    if (!(StorageKeys.SETTINGS in changes)) {
      return;
    }
    callback(JSON.parse(changes[StorageKeys.SETTINGS].newValue));
  };
  chrome.storage.local.onChanged.addListener(handleStorageChange);
  return () => {
    chrome.storage.local.onChanged.removeListener(handleStorageChange);
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    loadSettings().then(setSettings);
    return addSettingsListener(setSettings);
  }, []);

  const updateSettings = (settings: Settings) => {
    saveSettings(settings).then(() => setSettings(settings));
  };

  return [settings, updateSettings] as const;
}
