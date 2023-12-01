import { useMemo } from 'react';
import {
  GITLAB_STATUS,
  GITLAB_USER_ASSIGNED_STATUS_LIST,
  useCurrentGitLabProject,
  useGitLabApiContext,
  useStatusLabel,
} from 'shared/gitlab';
import query from 'shared/query';
import GitLabLabelChip from '../GitLabLabelChip';

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

  const label = useStatusLabel({ status, api });

  if (!api || !project || !issueId || !currentUser || !label) {
    return;
  }

  const applyIssueStatus = () => {
    const assignee_ids = GITLAB_USER_ASSIGNED_STATUS_LIST.includes(
      status as GITLAB_STATUS,
    )
      ? [currentUser.id]
      : 0;

    api.projects.updateIssue(project.id, issueId, {
      add_labels: label.name,
      assignee_ids,
    });
  };

  return (
    <button
      role="menuitem"
      type="button"
      className="gl-new-dropdown-item-content"
      onClick={() => {
        applyIssueStatus();
        onClick();
      }}
    >
      <span className="gl-new-dropdown-item-text-wrapper">
        <GitLabLabelChip label={label} />
      </span>
    </button>
  );
}
