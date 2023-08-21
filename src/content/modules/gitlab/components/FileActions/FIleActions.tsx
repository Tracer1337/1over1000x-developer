import query from 'shared/query';
import OpenVSCodeButton from '../OpenVSCodeButton';

export function FileActions({ path }: { path: () => string }) {
  const closeMenu = () =>
    query('gitlab.mr-diff.file-menu-buttons', path())?.click();

  return (
    <>
      <li role="presentation" className="gl-dropdown-item">
        <OpenVSCodeButton onClick={closeMenu} path={path} />
      </li>
    </>
  );
}
