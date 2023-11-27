import { useCurrentGitLabProject, useGitLabApi } from 'shared/gitlab';
import query from 'shared/query';

export function IssueStatusButton({
  status,
  onClick,
}: {
  status: string;
  onClick: () => void;
}) {
  const api = useGitLabApi();

  const project = useCurrentGitLabProject();

  const applyIssueStatus = () => {
    const issueId = query('gitlab.issue.id');
    if (!api || !project || !issueId) {
      return;
    }
    api.projects.setIssueStatus(project.id, issueId, status);
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
      <span className="gl-new-dropdown-item-text-wrapper">{status}</span>
    </button>
  );
}
