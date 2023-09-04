import { useState, useEffect } from 'react';
import { Settings, loadSettings, saveSettings } from 'shared/storage';

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
