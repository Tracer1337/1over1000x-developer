export enum StorageKeys {
  SETTINGS = 'settings',
}

export type Settings = {
  chatGPTApiKey: string | null;
  recordGif: boolean;
};

function getDefaultSettings(): Settings {
  return {
    chatGPTApiKey: null,
    recordGif: false,
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
