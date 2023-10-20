import { useEffect, useState } from 'react';
import { loadSettings } from 'shared/settings';
import { Module } from 'shared/types';

export type ModuleForm = {
  hosts: string[];
};

const loadModuleForm = async (module: Module): Promise<ModuleForm> => {
  const settings = await loadSettings();
  return {
    hosts: settings.modules[module].hosts,
  };
};

export function useModuleForm(
  module: Module,
  submit: (form: ModuleForm) => Promise<void>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const [hosts, setHosts] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    loadModuleForm(module).then((form) => {
      setHosts(form.hosts);
      setIsLoading(false);
    });
  }, []);

  const addHost = (host: string) => {
    let formattedHost = host;
    try {
      formattedHost = new URL(host).hostname;
    } catch {}
    const newHosts = [...hosts, formattedHost];
    setHosts(newHosts);
    submit({ hosts: newHosts });
  };

  const removeHost = (index: number) => {
    const newHosts = hosts.slice(0, index).concat(hosts.slice(index + 1));
    setHosts(newHosts);
    submit({ hosts: newHosts });
  };

  return {
    hosts,
    addHost,
    removeHost,
    isLoading,
  };
}
