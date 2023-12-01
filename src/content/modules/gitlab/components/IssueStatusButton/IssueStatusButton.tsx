import { useMemo } from 'react';
import {
  GITLAB_STATUS,
  applyIssueStatus,
  useCurrentGitLabProject,
  useGitLabApiContext,
} from 'shared/gitlab';
import query from 'shared/query';

export function IssueStatusButton({
  status,
  onClick,
}: {
  status: GITLAB_STATUS;
  onClick: () => void;
}) {
  const api = useGitLabApiContext();

  const project = useCurrentGitLabProject({ api });

  const issueId = useMemo(() => query('gitlab.issue.id'), []);
  const currentUser = useMemo(() => query('gitlab.issue.current-user'), []);

  if (!api || !project || !issueId || !currentUser) {
    return;
  }

  return (
    <button
      role="menuitem"
      type="button"
      className="gl-new-dropdown-item-content"
      onClick={() => {
        applyIssueStatus({
          api,
          issueId,
          projectId: project.id,
          currentUser,
          status,
        });
        onClick();
      }}
    >
      <span className="gl-new-dropdown-item-text-wrapper">{status}</span>
    </button>
  );
}
