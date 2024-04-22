import { GITLAB_STATUS, useStatusLabel } from 'shared/gitlab';
import GitLabLabelChip from '../GitLabLabelChip';
import { useApplyIssueStatus } from './hooks/useApplyIssueStatus';

export function IssueStatusButton({
  status,
  onClick,
}: {
  status: GITLAB_STATUS;
  onClick: () => void;
}) {
  const label = useStatusLabel({ status });

  const applyIssueStatus = useApplyIssueStatus({ status });

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
        {label && <GitLabLabelChip label={label} />}
      </span>
    </button>
  );
}
