import { Module } from 'shared/types';
import { useSettings } from 'shared/settings';
import { produce } from 'immer';

export function useModules() {
  const [settings, setSettings] = useSettings();

  const toggleModule = (module: Module) => {
    if (!settings) {
      return;
    }
    setSettings(
      produce(settings, (draft) => {
        draft.modules[module].enabled = !draft.modules[module].enabled;
      }),
    );
  };

  return [settings?.modules, toggleModule] as const;
}
