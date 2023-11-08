import { createElement, useEffect, useMemo, useState } from 'react';
import { Button } from '@mui/material';
import { GitLabApi, GitLabProject } from 'shared/gitlab';
import { useDebouncedEffect } from 'shared/dom';
import { SpotlightResult } from 'spotlight/components/Results/types';
import { useSpotlight } from 'spotlight/components/Spotlight/context';
import { GitlabIssueResult } from '../GitlabIssueResult';

export function useGitlabIssueResults(): SpotlightResult[] {
  const {
    input,
    settings: {
      modules: {
        gitlab: { config },
      },
    },
  } = useSpotlight();

  const [project, setProject] = useState<GitLabProject>();
  const [issuesBySearch, setIssuesBySearch] = useState<SpotlightResult[]>([]);
  const [showAll, setShowAll] = useState(false);

  const api = useMemo(() => {
    if (!config.host || !config.token) {
      return;
    }
    return new GitLabApi(config.host, config.token);
  }, [config]);

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

  useDebouncedEffect(
    () => {
      if (!api || !project || input.length === 0 || input[0] === '>') {
        return;
      }

      const controller = new AbortController();

      api.projects
        .issues(project.id, { search: input }, { signal: controller.signal })
        .then((issues) =>
          setIssuesBySearch(
            issues.map((issue) => ({
              id: `gitlab-issue-${issue.iid}`,
              node: createElement(GitlabIssueResult, {
                issueId: issue.iid,
                title: issue.title,
              }),
            })),
          ),
        )
        .catch(() => {});

      return () => {
        controller.abort();
        setIssuesBySearch([]);
      };
    },
    [api, project, input],
    200,
  );

  if (!config.host || !config.project) {
    return [];
  }

  const ids = input.match(/\b\d{4}\b/g)?.map((id) => parseInt(id)) ?? [];
  const distinctIds = Array.from(new Set(ids));
  const issuesById = distinctIds.map((id) => ({
    id: `gitlab-issue-${id}`,
    node: createElement(GitlabIssueResult, { issueId: id }),
  }));

  const results = [...issuesById, ...issuesBySearch];

  if (results.length <= 3) {
    return results;
  }

  if (!showAll) {
    return [
      ...results.slice(0, 3),
      {
        id: 'gitlab-issue-show-more',
        node: createElement(
          Button,
          {
            onClick: () => setShowAll(true),
            sx: { width: '100%' },
            size: 'small',
          },
          'Show More',
        ),
      },
    ];
  }

  return [
    ...results,
    {
      id: 'gitlab-issue-show-more',
      node: createElement(
        Button,
        {
          onClick: () => setShowAll(false),
          sx: { width: '100%' },
          size: 'small',
        },
        'Show Less',
      ),
    },
  ];
}
