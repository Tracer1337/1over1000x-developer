import { Settings, useSettings } from 'shared/storage';

export function useModules() {
  const [settings, setSettings] = useSettings();

  const toggleModule = (module: keyof Settings['modules']) => {
    if (!settings) {
      return;
    }
    setSettings({
      ...settings,
      modules: {
        ...settings.modules,
        [module]: !settings.modules[module],
      },
    });
  };

  return [settings?.modules, toggleModule] as const;
}
