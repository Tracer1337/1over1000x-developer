const ISSUE_STATUS_LABELS = new Set([
  'ready for code review',
  'ready for QA',
  'ready for merge',
]);

const queries = {
  ['gitlab.issue.title']: () => {
    return document.querySelector('h1')?.textContent ?? null;
  },
  ['gitlab.issue.id']: () => {
    const match = location.pathname.match(/\d+$/)?.[0];
    return match ? parseInt(match) : null;
  },
  ['gitlab.issue.status']: () => {
    return (
      Array.from(
        document.querySelectorAll(
          '[data-testid="sidebar-labels"] [data-testid="collapsed-content"] .gl-label-text-scoped',
        ),
      )
        .map((element) => element.textContent?.trim())
        .filter((label): label is string => !!label)
        .find((label) => ISSUE_STATUS_LABELS.has(label)) ?? null
    );
  },
  ['gitlab.issue.mr-url']: () => {
    return (
      document
        .querySelector(
          '.js-issue-widgets .card ul.related-items-list li:last-child a',
        )
        ?.getAttribute('href') ?? null
    );
  },
  ['gitlab.issue.menu-button']: () => {
    return document.querySelector<HTMLButtonElement>(
      '#new-actions-header-dropdown__BV_toggle_',
    );
  },
  ['gitlab.mr-pipeline.current-ref']: () => {
    const anchorElement = document.querySelector(
      '.merge-request-details a[title]',
    );
    if (!anchorElement) {
      throw new Error(
        "Element with selector '.merge-request-details a[title]' could not be found",
      );
    }
    const currentBranchName = anchorElement.getAttribute('title');
    return currentBranchName ? `refs/heads/${currentBranchName}` : null;
  },
  ['gitlab.mr-diff.file-menu-buttons']: (path: string) => {
    return document.querySelector<HTMLButtonElement>(
      `[data-path="${path}"] .dropdown-toggle`,
    );
  },
};

function query<K extends keyof typeof queries>(
  key: K,
  ...args: Parameters<(typeof queries)[K]>
): ReturnType<(typeof queries)[K]> {
  return (queries[key] as any)(...args) as ReturnType<(typeof queries)[K]>;
}

export default query;
