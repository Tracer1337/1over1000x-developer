import { createElement } from 'react';
import { SpotlightResult } from 'spotlight/components/Results/types';
import {
  SpotlightContextValue,
  useSpotlight,
} from 'spotlight/components/Spotlight/context';
import { GoogleResult } from '../GoogleResult';

function createGoogleResult(spotlight: SpotlightContextValue): SpotlightResult {
  const { input, onClose } = spotlight;

  const action = () => {
    window.open(`https://www.google.com/search?q=${input}`, '_blank');
    onClose();
  };

  const props = {
    id: 'google',
    action,
  };

  return {
    ...props,
    node: createElement(GoogleResult, props),
    wrapperProps: {
      sx: {
        width: 'calc(50% - 4px)',
      },
    },
  };
}

export function useGoogleResults(): SpotlightResult[] {
  const spotlight = useSpotlight();

  const { input } = spotlight;

  if (input.length === 0 || input[0] === '>') {
    return [];
  }

  return [createGoogleResult(spotlight)];
}
