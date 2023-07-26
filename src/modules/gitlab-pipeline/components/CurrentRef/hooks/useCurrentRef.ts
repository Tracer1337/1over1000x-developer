import { useMemo } from 'react';

export function useCurrentRef() {
  const currentRef = useMemo(() => {
    const anchorElement = document.querySelector(
      '.merge-request-details a[title]',
    );
    if (!anchorElement) {
      throw new Error(
        "Element with selector '.merge-request-details a[title]' could not be found",
      );
    }
    const currentBranchName = anchorElement.getAttribute('title');
    return `refs/heads/${currentBranchName}`;
  }, []);

  return currentRef;
}
