import React from 'react';
import { createRoot } from 'react-dom/client';
import { getOrCreateContainer, shouldHandleElement } from 'shared/dom';
import IssueActions from './components/IssueActions';

export function setupIssueActions() {
  render();
}

function render() {
  const container = getOrCreateContainer(
    'issue-actions',
    '#new-actions-header-dropdown .gl-dropdown-contents',
  );
  if (shouldHandleElement(container)) {
    createRoot(container).render(React.createElement(IssueActions));
  }
}
