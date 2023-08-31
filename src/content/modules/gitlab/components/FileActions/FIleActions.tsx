import query from 'shared/query';
import OpenVSCodeButton from '../OpenVSCodeButton';
import type { FileHelperPages } from '../../file';

export function FileActions({
  path,
  page,
}: {
  path: () => string;
  page: FileHelperPages;
}) {
  const closeMenu = () =>
    query('gitlab.mr-diff.file-menu-button', path())?.click();

  return <OpenVSCodeButton onClick={closeMenu} path={path} page={page} />;
}
