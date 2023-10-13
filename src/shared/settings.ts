import {
  Settings,
  StorageKeys,
  loadStorageValue,
  saveStorageValue,
  useStorageValue,
} from './storage';
import { moduleDefs } from './types';

function getDefaultSettings(): Settings {
  return {
    chatGPTApiKey: null,
    captureFormat: 'webm',
    captureFramerate: 15,
    modules: Object.fromEntries(
      moduleDefs.map(({ key }) => [key, true]),
    ) as Settings['modules'],
    spotlightHosts: [],
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
    captureFramerate:
      values.captureFramerate ?? defaultSettings.captureFramerate,
    modules: Object.fromEntries(
      moduleDefs.map(({ key }) => [
        key,
        values.modules?.[key] ?? defaultSettings.modules[key],
      ]),
    ) as Settings['modules'],
    spotlightHosts: values.spotlightHosts ?? defaultSettings.spotlightHosts,
  };
}

export async function loadSettings() {
  const storage = await loadStorageValue(StorageKeys.SETTINGS);
  return createSettingsObject(storage ?? {});
}

export async function saveSettings(settings: Settings) {
  await saveStorageValue(StorageKeys.SETTINGS, createSettingsObject(settings));
}

export function useSettings() {
  const [settings, setSettings] = useStorageValue(StorageKeys.SETTINGS);
  return [
    createSettingsObject(settings ?? {}),
    (newValue: Settings) => setSettings(createSettingsObject(newValue)),
  ] as const;
}
