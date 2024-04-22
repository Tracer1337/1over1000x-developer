import { useMemo } from 'react';
import {
  GITLAB_STATUS,
  GITLAB_USER_ASSIGNED_STATUS_LIST,
  useCurrentGitLabProject,
  useGitLabApiContext,
  useIssueDeveloper,
  useStatusLabel,
} from 'shared/gitlab';
import query from 'shared/query';

export function useApplyIssueStatus({ status }: { status: GITLAB_STATUS }) {
  const api = useGitLabApiContext();

  const project = useCurrentGitLabProject();

  const label = useStatusLabel({ status });

  const issueDeveloper = useIssueDeveloper();

  const issueId = useMemo(() => query('gitlab.issue.id'), []);
  const currentUser = useMemo(() => query('gitlab.issue.current-user'), []);

  const findIssueAssignee = (
    currentUser: { id: number },
    issueDeveloper: number,
  ) => {
    if (!GITLAB_USER_ASSIGNED_STATUS_LIST.includes(status)) {
      return null;
    }

    if (status === GITLAB_STATUS.IN_PROGRESS && issueDeveloper !== -1) {
      return issueDeveloper;
    }

    return currentUser.id;
  };

  const applyIssueStatus = () => {
    if (!project || !label || !issueId || !currentUser || !issueDeveloper) {
      return;
    }

    const userId = findIssueAssignee(currentUser, issueDeveloper);

    api.projects.updateIssue(project.id, issueId, {
      add_labels: label.name,
      assignee_ids: userId !== null ? [userId] : 0,
    });
  };

  return applyIssueStatus;
}
