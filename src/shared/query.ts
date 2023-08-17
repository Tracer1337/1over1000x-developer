export function queryIssueTitle() {
  return document.querySelector('h1')?.textContent ?? null;
}

export function queryIssueNumber() {
  const match = location.pathname.match(/\d+$/)?.[0];
  return match ? parseInt(match) : null;
}

const issueStatusLabels = new Set([
  'ready for code review',
  'ready for QA',
  'ready for merge',
]);

export function queryIssueStatus() {
  return (
    Array.from(
      document.querySelectorAll(
        '[data-testid="sidebar-labels"] [data-testid="collapsed-content"] .gl-label-text-scoped',
      ),
    )
      .map((element) => element.textContent?.trim())
      .filter((label): label is string => !!label)
      .find((label) => issueStatusLabels.has(label)) ?? null
  );
}

export function queryIssueMRUrl() {
  return (
    document
      .querySelector(
        '.js-issue-widgets .card ul.related-items-list li:last-child a',
      )
      ?.getAttribute('href') ?? null
  );
}

export function queryCurrentRef() {
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
}
