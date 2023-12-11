import { useStatusMessage } from './hooks/useStatusMessage';

export function StatusMessageButton({ onClick }: { onClick: () => void }) {
  const [canCopyStatusMessage, copyStatusMessage] = useStatusMessage();

  return (
    <>
      <button
        role="menuitem"
        type="button"
        className="gl-new-dropdown-item-content"
        onClick={() => copyStatusMessage().then(() => onClick())}
        disabled={!canCopyStatusMessage}
      >
        <span className="gl-new-dropdown-item-text-wrapper">
          Copy status message
        </span>
      </button>
    </>
  );
}
