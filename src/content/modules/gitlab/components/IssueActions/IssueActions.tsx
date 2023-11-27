import query from 'shared/query';
import StatusMessageButton from '../StatusMessageButon';
import TabGroupButton from '../TabGroupButton';
import IssueStatusButton from '../IssueStatusButton';
import {
  GITLAB_STATUS,
  findNextIssueStatus,
  useIssueStatus,
} from 'shared/gitlab';

export function IssueActions() {
  const issueStatus = useIssueStatus();

  const closeMenu = () => query('gitlab.issue.menu-button')?.click();

  const nextIssueStatus =
    issueStatus !== null ? findNextIssueStatus(issueStatus) : null;

  return (
    <>
      <li role="presentation" className="gl-new-dropdown-item">
        <TabGroupButton onClick={closeMenu} />
      </li>
      <li role="presentation" className="gl-new-dropdown-item">
        <StatusMessageButton onClick={closeMenu} />
      </li>
      {nextIssueStatus && (
        <li role="presentation" className="gl-new-dropdown-item">
          <IssueStatusButton onClick={closeMenu} status={nextIssueStatus} />
        </li>
      )}
      <li role="presentation" className="gl-new-dropdown-item">
        <IssueStatusButton
          onClick={closeMenu}
          status={GITLAB_STATUS.IN_PROGRESS}
        />
      </li>
    </>
  );
}
