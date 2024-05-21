import { useMemo } from 'react';
import { getDefaultValues, isZodObject } from './schema';
import {
  Settings,
  StorageKeys,
  addStorageValueListener,
  loadStorageValue,
  saveStorageValue,
  useStorageValue,
} from './storage';
import { moduleDefs } from './types';

function getDefaultSettings(): Settings {
  return {
    chatGPTApiKey: null,
    captureFormat: 'webm',
    modules: Object.fromEntries(
      moduleDefs.map(({ key, config }) => [
        key,
        {
          enabled: true,
          config: isZodObject(config) ? getDefaultValues(config) : undefined,
        },
      ]),
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
        {
          enabled:
            values.modules?.[key]?.enabled ??
            defaultSettings.modules[key].enabled,
          config:
            values.modules?.[key]?.config ??
            defaultSettings.modules[key].config,
        },
      ]),
    ) as Settings['modules'],
  };
}

export async function loadSettings() {
  const storage = await loadStorageValue(StorageKeys.SETTINGS);
  return createSettingsObject(storage ?? {});
}

export async function addSettingsListener(callback: (value: Settings) => void) {
  return addStorageValueListener(StorageKeys.SETTINGS, (storage) =>
    callback(createSettingsObject(storage ?? {})),
  );
}

export async function saveSettings(settings: Settings) {
  await saveStorageValue(StorageKeys.SETTINGS, createSettingsObject(settings));
}

export function useSettings() {
  const [settings, setSettings] = useStorageValue(StorageKeys.SETTINGS);
  return [
    useMemo(() => createSettingsObject(settings ?? {}), [settings]),
    (newValue: Settings) => setSettings(createSettingsObject(newValue)),
  ] as const;
}
