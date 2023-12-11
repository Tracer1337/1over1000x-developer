import qs from 'qs';
import {
  PropsWithChildren,
  createContext,
  createElement,
  useContext,
} from 'react';
import { useGitLabApi } from './hooks';

enum GITLAB_API_CACHE_KEYS {
  PROJECTS,
  LABELS,
}

export class GitLabApi {
  public readonly projects = new GitLabProjects(this);

  private readonly cache: Partial<{
    [GITLAB_API_CACHE_KEYS.PROJECTS]: Promise<GitLabProject[]>;
    [GITLAB_API_CACHE_KEYS.LABELS]: Promise<GitLabLabel[]>;
  }> = {};

  private readonly url: string;

  constructor(host: string, private readonly token: string) {
    this.url = `https://${host}/api/v4`;
  }

  public async request<T>(
    path: string,
    params = {},
    init?: RequestInit,
  ): Promise<T> {
    return fetch(
      `${this.url}${path}?${qs.stringify(params, { indices: false })}`,
      {
        headers: {
          'PRIVATE-TOKEN': this.token,
        },
        ...init,
      },
    ).then((res) => res.json());
  }

  public cached<K extends GITLAB_API_CACHE_KEYS>(
    key: K,
    fetcher: () => GitLabApi['cache'][K],
  ) {
    this.cache[key] = this.cache[key] ?? fetcher();
    return this.cache[key]!;
  }
}

export type GitLabProject = {
  id: number;
  path_with_namespace: string;
};

export type GitLabIssue = {
  iid: number;
  title: string;
};

export type GitLabLabel = {
  id: number;
  name: string;
  color: string;
};

class GitLabProjects {
  constructor(private readonly api: GitLabApi) {}

  public all(init?: RequestInit) {
    return this.api.cached(GITLAB_API_CACHE_KEYS.PROJECTS, () =>
      this.api.request<GitLabProject[]>('/projects', {}, init),
    );
  }

  public issues(
    projectId: number,
    params?: { search?: string },
    init?: RequestInit,
  ) {
    return this.api.request<GitLabIssue[]>(
      `/projects/${projectId}/issues`,
      params,
      init,
    );
  }

  public async updateIssue(
    projectId: number,
    issueId: number,
    params: {
      add_labels?: string;
      assignee_ids?: number[] | 0;
    },
    init?: RequestInit,
  ) {
    return this.api.request<void>(
      `/projects/${projectId}/issues/${issueId}`,
      params,
      { method: 'PUT', ...init },
    );
  }

  public labels(projectId: number, init?: RequestInit) {
    return this.api.cached(GITLAB_API_CACHE_KEYS.LABELS, () =>
      this.api.request<GitLabLabel[]>(
        `/projects/${projectId}/labels`,
        {},
        init,
      ),
    );
  }
}

const GitLabApiContext = createContext<GitLabApi | null>(null);

export function GitLabApiContextProvider({ children }: PropsWithChildren<{}>) {
  const api = useGitLabApi();
  return !api
    ? null
    : createElement(GitLabApiContext.Provider, { value: api }, children);
}

export function useGitLabApiContext() {
  const api = useContext(GitLabApiContext);

  if (!api) {
    throw new Error(
      'useGitLabApiContext has to be called inside a GitLabApiContextProvider',
    );
  }

  return api;
}

export enum GITLAB_STATUS {
  SPRINT_BACKLOG = 'Sprint Backlog',
  IN_PROGRESS = 'in progress',
  READY_FOR_CODE_REVIEW = 'ready for code review',
  IN_CODE_REVIEW = 'in code review',
  READY_FOR_QA = 'ready for QA',
  IN_QA = 'in QA',
  READY_FOR_MERGE = 'ready for merge',
  IN_MERGING = 'in Merging',
}

export const GITLAB_STATUS_LIST = [
  GITLAB_STATUS.SPRINT_BACKLOG,
  GITLAB_STATUS.IN_PROGRESS,
  GITLAB_STATUS.READY_FOR_CODE_REVIEW,
  GITLAB_STATUS.IN_CODE_REVIEW,
  GITLAB_STATUS.READY_FOR_QA,
  GITLAB_STATUS.IN_QA,
  GITLAB_STATUS.READY_FOR_MERGE,
  GITLAB_STATUS.IN_MERGING,
];

export const GITLAB_USER_ASSIGNED_STATUS_LIST = [
  GITLAB_STATUS.IN_PROGRESS,
  GITLAB_STATUS.IN_CODE_REVIEW,
  GITLAB_STATUS.IN_QA,
  GITLAB_STATUS.IN_MERGING,
];

export function findNextIssueStatus(status: string) {
  return GITLAB_STATUS_LIST.find(
    (_value, index) => GITLAB_STATUS_LIST[index - 1] === status,
  );
}

export function getApiHeaders(): HeadersInit {
  return {
    'X-Csrf-Token': getCsrfToken(),
  };
}

function getCsrfToken() {
  const csrfToken = document
    .querySelector("meta[name='csrf-token']")
    ?.getAttribute('content');
  if (!csrfToken) {
    throw new Error('Could not find csrf token');
  }
  return csrfToken;
}

export function getGitLabProjectUrl(url: string) {
  return url.split('-')[0];
}
