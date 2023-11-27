import query from 'shared/query';
import StatusMessageButton from '../StatusMessageButon';
import TabGroupButton from '../TabGroupButton';

export function IssueActions() {
  const closeMenu = () => query('gitlab.issue.menu-button')?.click();

  return (
    <>
      <li role="presentation" className="gl-new-dropdown-item">
        <TabGroupButton onClick={closeMenu} />
      </li>
      <li role="presentation" className="gl-new-dropdown-item">
        <StatusMessageButton onClick={closeMenu} />
      </li>
    </>
  );
}
