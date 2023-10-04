const ISSUE_STATUS_LABELS = new Set([
  'ready for code review',
  'ready for QA',
  'ready for merge',
]);

/**
 * Format for query names: host.page.selector
 */
const queries = {
  ['gitlab.issue.title']: () => {
    return document.querySelector('h1')?.textContent ?? null;
  },
  ['gitlab.issue.id']: () => {
    const match = location.pathname.match(/\d+$/)?.[0];
    return match ? parseInt(match) : null;
  },
  ['gitlab.issue.status-container']: () => {
    return document.querySelector(
      '[data-testid="sidebar-labels"] [data-testid="collapsed-content"]',
    );
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
          '.js-issue-widgets a[href^="https://gitlab.dzh.hamburg/theraos/app/-/merge_requests/"]',
        )
        ?.getAttribute('href') ?? null
    );
  },
  ['gitlab.issue.menu-button']: () => {
    return document.querySelector<HTMLButtonElement>(
      '#new-actions-header-dropdown__BV_toggle_',
    );
  },
  ['gitlab.issue.title-input']: () => {
    return document.querySelector<HTMLInputElement>('#issue_title');
  },
  ['gitlab.issue.description-input']: () => {
    return document.querySelector<HTMLTextAreaElement>(
      'textarea[name="issue[description]"]',
    );
  },
  ['gitlab.mr-overview.thread-file-actions-sibling']: (file: Element) => {
    return file.querySelector('.more-actions ul li:nth-child(2)');
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
  ['gitlab.mr-diff.file-menu-button']: (path: string) => {
    return document.querySelector<HTMLButtonElement>(
      `[data-path="${path}"] .dropdown-toggle`,
    );
  },
  ['gitlab.mr-diff.file-actions-sibling']: (file: Element) => {
    return file.querySelector('ul[role="menu"] .gl-dropdown-item:nth-child(3)');
  },
};

function query<K extends keyof typeof queries>(
  key: K,
  ...args: Parameters<(typeof queries)[K]>
): ReturnType<(typeof queries)[K]> {
  return (queries[key] as any)(...args) as ReturnType<(typeof queries)[K]>;
}

export async function waitForQuery<K extends keyof typeof queries>(
  key: K,
  timeout = 5,
  ...args: Parameters<(typeof queries)[K]>
): Promise<ReturnType<(typeof queries)[K]>> {
  let result: ReturnType<(typeof queries)[K]> | null = null;
  const startTime = Date.now();
  while (!result) {
    result = query(key, ...args);
    if (Date.now() - startTime > timeout * 1000) {
      throw new Error(`Query ${key} could not be found`);
    }
    await new Promise(requestAnimationFrame);
  }
  return result;
}

export default query;
