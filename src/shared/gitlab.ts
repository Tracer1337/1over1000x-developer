import qs from 'qs';
import {
  PropsWithChildren,
  createContext,
  createElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSettings } from './settings';
import { useMutationObserver } from './dom';
import query from './query';

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

enum GITLAB_API_CACHE_KEYS {
  PROJECTS,
  LABELS,
}

export class GitLabApi {
  public readonly projects = new GitLabProjectAPI(this);

  private readonly cache: Partial<{
    [GITLAB_API_CACHE_KEYS.PROJECTS]: Promise<GitLabProject[]>;
    [GITLAB_API_CACHE_KEYS.LABELS]: Promise<GitLabLabel[]>;
  }> = {};

  private readonly url: string;

  constructor(host: string, private readonly token: string) {
    this.url = `https://${host}/api/v4`;
  }

  public async request(
    path: string,
    params = {},
    init?: RequestInit,
  ): Promise<Response> {
    return fetch(
      `${this.url}${path}?${qs.stringify(params, { indices: false })}`,
      {
        headers: {
          'PRIVATE-TOKEN': this.token,
        },
        ...init,
      },
    );
  }

  public async requestJSON<T>(
    path: string,
    params?: {},
    init?: RequestInit,
  ): Promise<T> {
    return this.request(path, params, init).then((res) => res.json());
  }

  public cached<K extends GITLAB_API_CACHE_KEYS>(
    key: K,
    fetcher: () => GitLabApi['cache'][K],
  ) {
    this.cache[key] = this.cache[key] ?? fetcher();
    return this.cache[key]!;
  }

  public async collectPagination<T>(
    request: (params?: {}, init?: RequestInit) => Promise<Response>,
  ): Promise<T[]> {
    const result: T[] = [];

    let page = 1;
    let totalPages = 1;

    do {
      const response = await request({ page, per_page: 100 });

      const data = await response.json();
      result.push(...data);

      totalPages = parseInt(response.headers.get('X-Total-Pages') ?? '1');
      page = parseInt(response.headers.get('X-Next-Page') ?? '1');
    } while (page <= totalPages);

    return result;
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

export type GitLabResourceLabelEvent = {
  id: number;
  user: {
    id: number;
  };
  resource_id: number;
  label: {
    id: number;
    name: string;
  };
  action: 'add' | 'remove';
};

class GitLabProjectAPI {
  constructor(private readonly api: GitLabApi) {}

  public all(init?: RequestInit) {
    return this.api.cached(GITLAB_API_CACHE_KEYS.PROJECTS, () =>
      this.api.requestJSON<GitLabProject[]>('/projects', {}, init),
    );
  }

  public issues(
    projectId: number,
    params?: { search?: string },
    init?: RequestInit,
  ) {
    return this.api.requestJSON<GitLabIssue[]>(
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
    return this.api.requestJSON<void>(
      `/projects/${projectId}/issues/${issueId}`,
      params,
      { method: 'PUT', ...init },
    );
  }

  public labels(projectId: number, init?: RequestInit) {
    return this.api.cached(GITLAB_API_CACHE_KEYS.LABELS, () =>
      this.api.collectPagination<GitLabLabel>((params, paginationInit) =>
        this.api.request(`/projects/${projectId}/labels`, params, {
          ...init,
          ...paginationInit,
        }),
      ),
    );
  }

  public resourceLabelEvents(
    projectId: number,
    issueId: number,
    init?: RequestInit,
  ) {
    return this.api.collectPagination<GitLabResourceLabelEvent>(
      (params, paginationInit) =>
        this.api.request(
          `/projects/${projectId}/issues/${issueId}/resource_label_events`,
          params,
          {
            ...init,
            ...paginationInit,
          },
        ),
    );
  }
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

function useGitLabApi() {
  const [settings] = useSettings();

  const {
    modules: {
      gitlab: { config },
    },
  } = settings;

  const api = useMemo(() => {
    if (!config.host || !config.token) {
      return null;
    }
    return new GitLabApi(config.host, config.token);
  }, [config]);

  return api;
}

export function useCurrentGitLabProject() {
  const api = useGitLabApiContext();

  const [settings] = useSettings();

  const {
    modules: {
      gitlab: { config },
    },
  } = settings;

  const [project, setProject] = useState<GitLabProject>();

  useEffect(() => {
    if (!api || !config.project) {
      return;
    }

    api.projects
      .all()
      .then((projects) =>
        setProject(
          projects.find(
            (project) => '/' + project.path_with_namespace === config.project,
          ),
        ),
      );
  }, [api, config]);

  return project;
}

export function useIssueStatus() {
  const [issueStatus, setIssueStatus] = useState<string | null>(null);

  useMutationObserver(
    () => setIssueStatus(query('gitlab.issue.status')),
    query('gitlab.issue.status-container'),
  );

  useEffect(() => {
    if (issueStatus) {
      return;
    }
    const id = setInterval(() => {
      setIssueStatus(query('gitlab.issue.status'));
    }, 500);
    return () => clearInterval(id);
  }, [issueStatus]);

  return issueStatus;
}

export function useStatusLabel({ status }: { status: GITLAB_STATUS }) {
  const api = useGitLabApiContext();

  const [label, setLabel] = useState<GitLabLabel | null>(null);

  const project = useCurrentGitLabProject();

  useEffect(() => {
    if (!project) {
      return;
    }

    api.projects.labels(project.id).then((labels) => {
      const statusLabel = labels.find(({ name }) => name.endsWith(status));

      if (!statusLabel) {
        throw new Error(`No label found for status: ${status}`);
      }

      setLabel(statusLabel);
    });
  }, [status, api, project]);

  return label;
}

export function useIssueDeveloper() {
  const api = useGitLabApiContext();

  const [userId, setUserId] = useState<number | null>(null);

  const project = useCurrentGitLabProject();

  const issueId = useMemo(() => query('gitlab.issue.id'), []);

  useEffect(() => {
    if (!project || !issueId) {
      return;
    }

    api.projects.resourceLabelEvents(project.id, issueId).then((events) => {
      const codeReviewEvent = events.find(
        (event) =>
          event.action === 'add' &&
          event.label.name.endsWith(GITLAB_STATUS.READY_FOR_CODE_REVIEW),
      );

      setUserId(codeReviewEvent ? codeReviewEvent.user.id : -1);
    });
  }, [issueId, api, project]);

  return userId;
}
