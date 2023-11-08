import qs from 'qs';

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
    return fetch(`${this.url}${path}?${qs.stringify(params)}`, {
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
}
