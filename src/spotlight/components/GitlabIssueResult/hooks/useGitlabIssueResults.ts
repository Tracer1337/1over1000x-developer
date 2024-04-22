import { createElement, useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useCurrentGitLabProject, useGitLabApiContext } from 'shared/gitlab';
import { useDebouncedEffect } from 'shared/dom';
import { SpotlightResult } from 'spotlight/components/Results/types';
import {
  SpotlightContextValue,
  useSpotlight,
} from 'spotlight/components/Spotlight/context';
import { GitlabIssueResult } from '../GitlabIssueResult';

function createGitLabResult(
  spotlight: SpotlightContextValue,
  args: {
    id: string;
    title?: string;
    issueId: number;
  },
): SpotlightResult {
  const {
    settings: {
      modules: {
        gitlab: {
          config: { host, project },
        },
      },
    },
    onClose,
  } = spotlight;

  const href = `https://${host}${project}/-/issues/${args.issueId}`;

  const action = () => {
    window.open(href, '_blank');
    onClose();
  };

  const props = {
    ...args,
    action,
  };

  return {
    ...props,
    node: createElement(GitlabIssueResult, props),
  };
}

function createButtonResult(props: {
  id: string;
  title: string;
  action: () => void;
}): SpotlightResult {
  return {
    ...props,
    node: createElement(
      Button,
      {
        // @ts-ignore
        'data-result-id': props.id,
        'data-focusable': true,
        'onClick': props.action,
        'sx': { width: '100%' },
      },
      props.title,
    ),
  };
}

export function useGitlabIssueResults(): SpotlightResult[] {
  const spotlight = useSpotlight();

  const {
    input,
    focus,
    settings: {
      modules: {
        gitlab: { config },
      },
    },
  } = spotlight;

  const [issuesBySearch, setIssuesBySearch] = useState<SpotlightResult[]>([]);
  const [showAll, setShowAll] = useState(false);

  const api = useGitLabApiContext();

  const project = useCurrentGitLabProject();

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
            issues.map((issue) =>
              createGitLabResult(spotlight, {
                id: `gitlab-issue-${issue.iid}`,
                issueId: issue.iid,
                title: issue.title,
              }),
            ),
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

  useEffect(() => {
    setShowAll(false);
  }, [input]);

  if (!config.host || !config.project) {
    return [];
  }

  const ids = input.match(/\b\d{4}\b/g)?.map((id) => parseInt(id)) ?? [];
  const distinctIds = Array.from(new Set(ids));
  const issuesById = distinctIds.map((id) =>
    createGitLabResult(spotlight, {
      id: `gitlab-issue-${id}`,
      issueId: id,
    }),
  );

  const results = [...issuesById, ...issuesBySearch];

  if (results.length <= 1) {
    return results;
  }

  if (!showAll) {
    return [
      results[0],
      createButtonResult({
        id: 'gitlab-issue-show-more',
        title: 'Show More',
        action: async () => {
          setShowAll(true);
          await new Promise(requestAnimationFrame);
          focus.next(
            document.querySelector(`[data-result-id=${results[1].id}]`),
          );
        },
      }),
    ];
  }

  return [
    ...results,
    createButtonResult({
      id: 'gitlab-issue-show-more',
      title: 'Show Less',
      action: () => setShowAll(false),
    }),
  ];
}
