import { useState, useEffect } from 'react';

export enum StorageKeys {
  SETTINGS = 'settings',
  POPUP_TAB = 'popup_tab',
}

export type Settings = {
  chatGPTApiKey: string | null;
  recordGif: boolean;
  modules: Record<'gitlab' | 'spotlight', boolean>;
};

function getDefaultSettings(): Settings {
  return {
    chatGPTApiKey: null,
    recordGif: false,
    modules: {
      gitlab: true,
      spotlight: true,
    },
  };
}

export async function loadSettings(): Promise<Settings> {
  const json = (await chrome.storage.local.get(StorageKeys.SETTINGS))[
    StorageKeys.SETTINGS
  ];
  return Object.assign(getDefaultSettings(), json ? JSON.parse(json) : {});
}

export async function saveSettings(settings: Settings) {
  await chrome.storage.local.set({
    [StorageKeys.SETTINGS]: JSON.stringify(settings),
  });
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  const updateSettings = (settings: Settings) => {
    saveSettings(settings).then(() => setSettings(settings));
  };

  return [settings, updateSettings] as const;
}
