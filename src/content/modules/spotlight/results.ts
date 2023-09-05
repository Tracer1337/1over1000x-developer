import { commandDefs } from 'shared/types';

export type SpotlightResult =
  | {
      type: 'command';
      id: string;
      data: {
        command: (typeof commandDefs)[number];
      };
    }
  | {
      type: 'gitlab-issue';
      id: string;
      data: {
        issueId: number;
      };
    };

export function generateResults(input: string) {
  return [
    ...generateCommandResults(input),
    ...generateGitlabIssueResults(input),
  ];
}

function generateCommandResults(
  input: string,
): Extract<SpotlightResult, { type: 'command' }>[] {
  if (input[0] !== '>') {
    return [];
  }
  input = input.slice(1);
  return commandDefs
    .filter(
      (command) =>
        input.length === 0 ||
        command.label.toLowerCase().startsWith(input.toLowerCase()),
    )
    .map((command) => ({
      type: 'command',
      id: `command-${command.key}`,
      data: { command },
    }));
}

function generateGitlabIssueResults(
  input: string,
): Extract<SpotlightResult, { type: 'gitlab-issue' }>[] {
  const ids = input.match(/\b\d{4}\b/g)?.map((id) => parseInt(id)) ?? [];
  const distinctIds = Array.from(new Set(ids));
  return distinctIds.map((id) => ({
    type: 'gitlab-issue',
    id: `gitlab-issue-${id}`,
    data: { issueId: id },
  }));
}
