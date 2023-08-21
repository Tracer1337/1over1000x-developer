export function OpenVSCodeButton({
  path,
  onClick,
}: {
  path: () => string;
  onClick: () => void;
}) {
  const openVSCode = () => {
    const url = `vscode://vscode-remote/wsl+Ubuntu/home/mmoelter/app/${path()}:1`;
    window.open(url, '_blank');
  };

  return (
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
  );
}
