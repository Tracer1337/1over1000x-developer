import { createElement } from 'react';
import { SpotlightResult } from 'spotlight/components/Results/types';
import { useSpotlight } from 'spotlight/components/Spotlight/context';
import { ChatGPTResult } from '../ChatGPTResult';

export function useChatGPTResults(): SpotlightResult[] {
  const { input } = useSpotlight();

  if (input.length === 0 || input[0] === '>') {
    return [];
  }

  return [
    {
      id: 'chatgpt',
      node: createElement(ChatGPTResult),
      wrapperProps: {
        sx: {
          width: 'calc(50% - 4px)',
        },
      },
    },
  ];
}
