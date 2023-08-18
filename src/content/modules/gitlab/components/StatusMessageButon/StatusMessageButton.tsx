import { useStatusMessage } from './hooks/useStatusMessage';

export function StatusMessageButton({ onClick }: { onClick: () => void }) {
  const copyStatusMessage = useStatusMessage();

  return (
    <>
      <button
        role="menuitem"
        type="button"
        className="dropdown-item"
        onClick={() => copyStatusMessage().then(() => onClick())}
      >
        <div className="gl-dropdown-item-text-wrapper">
          <p className="gl-dropdown-item-text-primary">Copy status message</p>
        </div>
      </button>
    </>
  );
}
