import { useEffect, useState } from 'react';
import { isZodObject } from 'shared/schema';
import { loadSettings } from 'shared/settings';
import { Module, ModuleConfig, moduleDefs } from 'shared/types';

export function useDefaultValue<K extends Module>(
  module: Extract<(typeof moduleDefs)[number], { key: K }>,
) {
  const [defaultValue, setDefaultValue] = useState<
    ModuleConfig<K>['config'] | null
  >(null);

  useEffect(() => {
    if (!isZodObject(module.config)) {
      return;
    }
    loadSettings().then((settings) =>
      setDefaultValue(settings.modules[module.key].config as any),
    );
  }, [module]);

  return defaultValue;
}
