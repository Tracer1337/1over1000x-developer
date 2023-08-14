import { useCreateTabGroup } from './hooks/useCreateTabGroup';

export function TabGroupButton() {
  const createTabGroup = useCreateTabGroup();

  return (
    <button
      role="menuitem"
      type="button"
      className="dropdown-item"
      onClick={createTabGroup}
    >
      <div className="gl-dropdown-item-text-wrapper">
        <p className="gl-dropdown-item-text-primary">Create tab group</p>
      </div>
    </button>
  );
}
