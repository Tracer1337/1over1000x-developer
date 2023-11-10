import { createElement } from 'react';
import { SpotlightResult } from 'spotlight/components/Results/types';
import {
  SpotlightContextValue,
  useSpotlight,
} from 'spotlight/components/Spotlight/context';
import { ChatGPTResult } from '../ChatGPTResult';
import { Event, senderId } from 'shared/bridge';

function createChatGPTResult(
  spotlight: SpotlightContextValue,
): SpotlightResult {
  const { input, onClose } = spotlight;

  const action = () => {
    const event: Event = {
      senderId,
      type: 'chatgpt.open',
      data: { prompt: input },
    };
    chrome.runtime.sendMessage(event).then(onClose);
  };

  const props = {
    id: 'chatgpt',
    action,
  };

  return {
    ...props,
    node: createElement(ChatGPTResult, props),
    wrapperProps: {
      sx: {
        width: 'calc(50% - 4px)',
      },
    },
  };
}

export function useChatGPTResults(): SpotlightResult[] {
  const spotlight = useSpotlight();

  const { input } = spotlight;

  if (input.length === 0 || input[0] === '>') {
    return [];
  }

  return [createChatGPTResult(spotlight)];
}
