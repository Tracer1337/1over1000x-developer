import { createElement } from 'react';
import { SpotlightResult } from 'spotlight/components/Results/types';
import { useSpotlight } from 'spotlight/components/Spotlight/context';
import { GoogleResult } from '../GoogleResult';

export function useGoogleResults(): SpotlightResult[] {
  const { input } = useSpotlight();

  if (input.length === 0 || input[0] === '>') {
    return [];
  }

  return [
    {
      id: 'google',
      node: createElement(GoogleResult),
      wrapperProps: {
        sx: {
          width: 'calc(50% - 4px)',
        },
      },
    },
  ];
}
