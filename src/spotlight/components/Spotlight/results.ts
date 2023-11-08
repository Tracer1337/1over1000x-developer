import {
  Observable,
  Subject,
  combineLatest,
  debounceTime,
  filter,
  from,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { GitLabApi } from 'shared/gitlab';
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
        title?: string;
      };
    }
);

export function createResultGenerator(
  settings: Settings,
  input: Subject<string>,
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
  input: Subject<string>,
): Observable<SpotlightResult[]> {
  return input.pipe(
    map((input) =>
      input.length === 0 || input[0] === '>'
        ? []
        : [
            {
              type: 'google',
              id: 'google',
              data: {
                search: input,
              },
            },
          ],
    ),
  );
}

function generateChatGPTResults(
  _settings: Settings,
  input: Subject<string>,
): Observable<SpotlightResult[]> {
  return input.pipe(
    map((input) =>
      input.length === 0 || input[0] === '>'
        ? []
        : [
            {
              type: 'chatgpt',
              id: 'chatgpt',
              data: {
                prompt: input,
              },
            },
          ],
    ),
  );
}

function generateCommandResults(
  _settings: Settings,
  input: Subject<string>,
): Observable<SpotlightResult[]> {
  return input.pipe(
    map((input) => {
      if (input[0] !== '>') {
        return [];
      }
      input = input.slice(1);
      return commandDefs
        .filter((command) => searchText(command.label, input))
        .map(
          (command) =>
            ({
              type: 'command',
              id: `command-${command.key}`,
              data: { command },
            } as const),
        );
    }),
  );
}

function generateGitlabIssueResults(
  settings: Settings,
  input: Subject<string>,
): Observable<SpotlightResult[]> {
  const { host, project, token } = settings.modules.gitlab.config;

  if (!host || !project) {
    return of([]);
  }

  const resultsById = input.pipe(
    map((input) => {
      const ids = input.match(/\b\d{4}\b/g)?.map((id) => parseInt(id)) ?? [];
      const distinctIds = Array.from(new Set(ids));
      return distinctIds.map(
        (id) =>
          ({
            type: 'gitlab-issue',
            id: `gitlab-issue-${id}`,
            data: { issueId: id },
          } as const),
      );
    }),
  );

  const gitlabProject = of(token).pipe(
    filter((token): token is NonNullable<typeof token> => !!token),
    map((token) => new GitLabApi(host, token)),
    switchMap((api) =>
      from(api.projects.all()).pipe(
        map((projects) =>
          projects.find(
            (project) =>
              '/' + project.path_with_namespace ===
              settings.modules.gitlab.config.project,
          ),
        ),
        filter((project): project is NonNullable<typeof project> => !!project),
        withLatestFrom(of(api)),
      ),
    ),
    shareReplay(1),
  );

  const resultsBySearch = input.pipe(
    debounceTime(300),
    switchMap((input) => {
      return gitlabProject.pipe(
        switchMap(([project, api]) =>
          from(api.projects.issues(project.id, { search: input })),
        ),
      );
    }),
    map((issues) =>
      issues.map(
        (issue) =>
          ({
            type: 'gitlab-issue',
            id: `gitlab-issue-${issue.iid}`,
            data: {
              issueId: issue.iid,
              title: issue.title,
            },
          } as const),
      ),
    ),
  );

  return combineLatest([resultsById, resultsBySearch.pipe(startWith([]))]).pipe(
    map((values) => values.flat()),
  );
}

function searchText(text: string, search: string) {
  return new RegExp(search, 'i').test(text);
}
