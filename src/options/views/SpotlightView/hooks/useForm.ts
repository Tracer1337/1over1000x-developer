import { useEffect, useState } from 'react';
import { loadSettings } from 'shared/settings';

export type SpotlightForm = {
  spotlightHosts: string[];
};

const loadSpotlightForm = async (): Promise<SpotlightForm> => {
  const settings = await loadSettings();
  return {
    spotlightHosts: settings.spotlightHosts,
  };
};

export function useSpotlightForm(
  submit: (form: SpotlightForm) => Promise<void>,
) {
  const [isLoading, setIsLoading] = useState(false);

  const [spotlightHosts, setSpotlightHosts] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    loadSpotlightForm().then((form) => {
      setSpotlightHosts(form.spotlightHosts);
      setIsLoading(false);
    });
  }, []);

  const addSpotlightHost = (host: string) => {
    let formattedHost = host;
    try {
      formattedHost = new URL(host).hostname;
    } catch {}
    const newHosts = [...spotlightHosts, formattedHost];
    setSpotlightHosts(newHosts);
    submit({ spotlightHosts: newHosts });
  };

  const removeSpotlightHost = (index: number) => {
    const newHosts = spotlightHosts
      .slice(0, index)
      .concat(spotlightHosts.slice(index + 1));
    setSpotlightHosts(newHosts);
    submit({ spotlightHosts: newHosts });
  };

  return {
    spotlightHosts,
    addSpotlightHost,
    removeSpotlightHost,
    isLoading,
  };
}
