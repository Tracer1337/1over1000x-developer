import { useCreateTabGroup } from './hooks/useCreateTabGroup';

export function TabGroupButton({ onClick }: { onClick: () => void }) {
  const createTabGroup = useCreateTabGroup();

  return (
    <button
      role="menuitem"
      type="button"
      className="gl-new-dropdown-item-content"
      onClick={() => {
        createTabGroup();
        onClick();
      }}
    >
      <span className="gl-new-dropdown-item-text-wrapper">
        Create tab group
      </span>
    </button>
  );
}
