import { GitLabLabel } from 'shared/gitlab';

export function GitLabLabelChip({ label }: { label: GitLabLabel }) {
  const [, icon, name] = label.name.match(/(.*)::\s(.*)/) ?? [];

  if (!icon || !name) {
    return;
  }

  return (
    <span
      className="gl-label hide-collapsed gl-label-scoped gl-label-text-light"
      style={{
        // @ts-ignore
        '--label-background-color': label.color,
        '--label-inset-border': `inset 0 0 0 2px ${label.color}`,
      }}
    >
      <a className="gl-link gl-label-link">
        <span className="gl-label-text">{icon}</span>
        <span className="gl-label-text-scoped">{name}</span>
      </a>
    </span>
  );
}
