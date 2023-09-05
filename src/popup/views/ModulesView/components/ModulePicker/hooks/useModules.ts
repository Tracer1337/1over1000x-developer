import { useSettings } from 'shared/storage';
import { Module } from 'shared/types';

export function useModules() {
  const [settings, setSettings] = useSettings();

  const toggleModule = (module: Module) => {
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
