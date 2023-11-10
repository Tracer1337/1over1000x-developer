import { createElement } from 'react';
import { commandDefs } from 'shared/types';
import { SpotlightResult } from 'spotlight/components/Results/types';
import {
  SpotlightContextValue,
  useSpotlight,
} from 'spotlight/components/Spotlight/context';
import { CommandResult } from '../CommandResult';
import { Event, senderId } from 'shared/bridge';

function createCommandResult(
  spotlight: SpotlightContextValue,
  command: (typeof commandDefs)[number],
): SpotlightResult {
  const { onClose } = spotlight;

  const action = () => {
    const event: Event = {
      senderId,
      type: `command.${command.key}`,
    };
    chrome.runtime.sendMessage(event).then(onClose);
  };

  const props = {
    id: `command-${command.key}`,
    command,
    action,
  };

  return {
    ...props,
    node: createElement(CommandResult, props),
  };
}

export function useCommandResults(): SpotlightResult[] {
  const spotlight = useSpotlight();

  const { input } = spotlight;

  if (input[0] !== '>') {
    return [];
  }

  const search = input.slice(1);

  return commandDefs
    .filter((command) => new RegExp(search, 'i').test(command.label))
    .map((command) => createCommandResult(spotlight, command));
}
