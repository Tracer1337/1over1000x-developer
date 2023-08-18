import { useCreateTabGroup } from './hooks/useCreateTabGroup';

export function TabGroupButton({ onClick }: { onClick: () => void }) {
  const createTabGroup = useCreateTabGroup();

  return (
    <button
      role="menuitem"
      type="button"
      className="dropdown-item"
      onClick={() => {
        createTabGroup();
        onClick();
      }}
    >
      <div className="gl-dropdown-item-text-wrapper">
        <p className="gl-dropdown-item-text-primary">Create tab group</p>
      </div>
    </button>
  );
}
