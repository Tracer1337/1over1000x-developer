export enum StorageKeys {
  SETTINGS = 'settings',
}

type Settings = {
  chatGPTApiKey: string | null;
};

function getDefaultSettings(): Settings {
  return {
    chatGPTApiKey: null,
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
