import { queryIssueMenuButton } from 'shared/query';
import StatusMessageButton from '../StatusMessageButon';
import TabGroupButton from '../TabGroupButton';

export function IssueActions() {
  const closeMenu = () => queryIssueMenuButton()?.click();

  return (
    <>
      <li role="presentation" className="gl-dropdown-item">
        <TabGroupButton onClick={closeMenu} />
      </li>
      <li role="presentation" className="gl-dropdown-item">
        <StatusMessageButton onClick={closeMenu} />
      </li>
    </>
  );
}
