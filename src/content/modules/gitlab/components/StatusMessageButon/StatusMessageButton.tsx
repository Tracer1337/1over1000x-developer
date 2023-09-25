import { useStatusMessage } from './hooks/useStatusMessage';

export function StatusMessageButton({ onClick }: { onClick: () => void }) {
  const [canCopyStatusMessage, copyStatusMessage] = useStatusMessage();

  return (
    <>
      <button
        role="menuitem"
        type="button"
        className="dropdown-item"
        onClick={() => copyStatusMessage().then(() => onClick())}
        disabled={!canCopyStatusMessage}
      >
        <div className="gl-dropdown-item-text-wrapper">
          <p className="gl-dropdown-item-text-primary">Copy status message</p>
        </div>
      </button>
    </>
  );
}
