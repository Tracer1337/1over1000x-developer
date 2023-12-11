import { useEffect, useMemo, useState } from 'react';
import { useSettings } from 'shared/settings';
import { GitLabApi, GitLabLabel, GitLabProject } from './api';
import { useMutationObserver } from 'shared/dom';
import query from 'shared/query';
import { GITLAB_STATUS } from 'shared/gitlab';

export function useGitLabApi() {
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

export function useCurrentGitLabProject({ api }: { api: GitLabApi | null }) {
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

export function useStatusLabel({
  status,
  api,
}: {
  status: GITLAB_STATUS;
  api: GitLabApi;
}) {
  const [label, setLabel] = useState<GitLabLabel | null>(null);

  const project = useCurrentGitLabProject({ api });

  useEffect(() => {
    if (!project) {
      return;
    }

    api.projects.labels(project.id).then((labels) => {
      const statusLabel = labels.find(({ name }) => name.includes(status));

      if (!statusLabel) {
        throw new Error(`No label found for status: ${status}`);
      }

      setLabel(statusLabel);
    });
  }, [status, api, project]);

  return label;
}
