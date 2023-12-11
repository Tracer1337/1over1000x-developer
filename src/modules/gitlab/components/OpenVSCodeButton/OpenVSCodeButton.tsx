import { match } from 'ts-pattern';
import type { FileHelperPages } from '../../lib/file';

export function OpenVSCodeButton({
  path,
  page,
  onClick,
}: {
  path: () => string;
  onClick: () => void;
  page: FileHelperPages;
}) {
  const openVSCode = () => {
    const url = `vscode://vscode-remote/wsl+Ubuntu/home/mmoelter/app/${path()}:1`;
    window.open(url, '_blank');
  };

  return match(page)
    .with('mr-overview', () => (
      <li role="presentation" className="gl-new-dropdown-item">
        <button
          role="menuitem"
          type="button"
          className="gl-new-dropdown-item-content"
          onClick={() => {
            openVSCode();
            onClick();
          }}
        >
          <div className="gl-new-dropdown-item-text-wrapper">
            Open in VSCode
          </div>
        </button>
      </li>
    ))
    .with('mr-diff', () => (
      <li role="presentation" className="gl-dropdown-item">
        <button
          role="menuitem"
          type="button"
          className="dropdown-item"
          onClick={() => {
            openVSCode();
            onClick();
          }}
        >
          <div className="gl-dropdown-item-text-wrapper">
            <p className="gl-dropdown-item-text-primary">Open in VSCode</p>
          </div>
        </button>
      </li>
    ))
    .exhaustive();
}
