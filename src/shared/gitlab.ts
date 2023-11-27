import qs from 'qs';
import { useEffect, useMemo, useState } from 'react';
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

export class GitLabApi {
  public readonly projects = new GitLabProjects(this);

  private readonly url: string;

  constructor(host: string, private readonly token: string) {
    this.url = `https://${host}/api/v4`;
  }

  public async request<T>(
    path: string,
    params = {},
    init?: RequestInit,
  ): Promise<T> {
    const query =
      Object.keys(params).length > 0 ? `?${qs.stringify(params)}` : '';
    return fetch(`${this.url}${path}${query}`, {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
      ...init,
    }).then((res) => res.json());
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
};

class GitLabProjects {
  constructor(private readonly api: GitLabApi) {}

  public all(init?: RequestInit) {
    return this.api.request<GitLabProject[]>('/projects', {}, init);
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

  public async setIssueStatus(
    projectId: number,
    issueId: number,
    status: string,
    init?: RequestInit,
  ) {
    const labels = await this.labels(projectId);
    const statusLabel = labels.find(({ name }) => name.indexOf(status) !== -1);
    if (!statusLabel) {
      throw new Error(`No label found for status: ${status}`);
    }
    return this.api.request<void>(
      `/projects/${projectId}/issues/${issueId}?add_labels=${statusLabel.name}`,
      {},
      { method: 'PUT', ...init },
    );
  }

  public labels(projectId: number, init?: RequestInit) {
    return this.api.request<GitLabLabel[]>(
      `/projects/${projectId}/labels`,
      {},
      init,
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

export function findNextIssueStatus(status: string) {
  return GITLAB_STATUS_LIST.find(
    (_value, index) => GITLAB_STATUS_LIST[index - 1] === status,
  );
}

export function useGitLabApi() {
  const [settings] = useSettings();

  const {
    modules: {
      gitlab: { config },
    },
  } = settings;

  const api = useMemo(() => {
    if (!config.host || !config.token) {
      return;
    }
    return new GitLabApi(config.host, config.token);
  }, [config]);

  return api;
}

export function useCurrentGitLabProject() {
  const [settings] = useSettings();

  const {
    modules: {
      gitlab: { config },
    },
  } = settings;

  const api = useGitLabApi();

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
