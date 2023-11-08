import { Observable, combineLatest, map, of } from 'rxjs';
import { Settings } from 'shared/storage';
import { commandDefs } from 'shared/types';

export type SpotlightResult = { id: string } & (
  | {
      type: 'google';
      data: {
        search: string;
      };
    }
  | {
      type: 'chatgpt';
      data: {
        prompt: string;
      };
    }
  | {
      type: 'command';
      data: {
        command: (typeof commandDefs)[number];
      };
    }
  | {
      type: 'gitlab-issue';
      data: {
        issueId: number;
      };
    }
);

export function generateResults(
  settings: Settings,
  input: string,
): Observable<SpotlightResult[]> {
  return combineLatest([
    generateGoogleResults(settings, input),
    generateChatGPTResults(settings, input),
    generateCommandResults(settings, input),
    generateGitlabIssueResults(settings, input),
  ]).pipe(map((results) => results.flat()));
}

function generateGoogleResults(
  _settings: Settings,
  input: string,
): Observable<SpotlightResult[]> {
  return input.length === 0 || input[0] === '>'
    ? of([])
    : of([
        {
          type: 'google',
          id: 'google',
          data: {
            search: input,
          },
        },
      ]);
}

function generateChatGPTResults(
  _settings: Settings,
  input: string,
): Observable<SpotlightResult[]> {
  return input.length === 0 || input[0] === '>'
    ? of([])
    : of([
        {
          type: 'chatgpt',
          id: 'chatgpt',
          data: {
            prompt: input,
          },
        },
      ]);
}

function generateCommandResults(
  _settings: Settings,
  input: string,
): Observable<SpotlightResult[]> {
  if (input[0] !== '>') {
    return of([]);
  }
  input = input.slice(1);
  return of(
    commandDefs
      .filter((command) => searchText(command.label, input))
      .map(
        (command) =>
          ({
            type: 'command',
            id: `command-${command.key}`,
            data: { command },
          } as const),
      ),
  );
}

function generateGitlabIssueResults(
  settings: Settings,
  input: string,
): Observable<SpotlightResult[]> {
  if (
    !settings.modules.gitlab.config.host ||
    !settings.modules.gitlab.config.project
  ) {
    return of([]);
  }
  const ids = input.match(/\b\d{4}\b/g)?.map((id) => parseInt(id)) ?? [];
  const distinctIds = Array.from(new Set(ids));
  return of(
    distinctIds.map(
      (id) =>
        ({
          type: 'gitlab-issue',
          id: `gitlab-issue-${id}`,
          data: { issueId: id },
        } as const),
    ),
  );
}

function searchText(text: string, search: string) {
  return new RegExp(search, 'i').test(text);
}
