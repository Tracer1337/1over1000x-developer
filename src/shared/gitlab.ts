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

  public async request<T>(path: string, params = {}): Promise<T> {
    return fetch(`${this.url}${path}?${qs.stringify(params)}`, {
      headers: {
        'PRIVATE-TOKEN': this.token,
      },
    }).then((res) => res.json());
  }
}

class GitLabProjects {
  constructor(private readonly api: GitLabApi) {}

  public all() {
    return this.api.request<
      {
        id: number;
        path_with_namespace: string;
      }[]
    >('/projects');
  }

  public issues(projectId: number, params?: { search?: string }) {
    return this.api.request<
      {
        iid: number;
        title: string;
      }[]
    >(`/projects/${projectId}/issues`, params);
  }
}
