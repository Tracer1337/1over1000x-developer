import { createElement } from 'react';
import { commandDefs } from 'shared/types';
import { SpotlightResult } from 'spotlight/components/Results/types';
import { useSpotlight } from 'spotlight/components/Spotlight/context';
import { CommandResult } from '../CommandResult';

export function useCommandResults(): SpotlightResult[] {
  const { input } = useSpotlight();

  if (input[0] !== '>') {
    return [];
  }

  const search = input.slice(1);

  return commandDefs
    .filter((command) => new RegExp(search, 'i').test(command.label))
    .map((command) => ({
      id: `command-${command.key}`,
      node: createElement(CommandResult, { command }),
    }));
}
