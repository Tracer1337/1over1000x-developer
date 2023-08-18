import React from 'react';
import { createRoot } from 'react-dom/client';
import { shouldHandleElement } from 'shared/dom';
import IssueActions from './components/IssueActions';

const menuSelector = '#new-actions-header-dropdown .gl-dropdown-contents';
const containerId = 'issue-actions';

export function setupIssueActions() {
  render();
}

function render() {
  const container = getContainer();
  if (shouldHandleElement(container)) {
    createRoot(container).render(React.createElement(IssueActions));
  }
}

function getContainer() {
  const menu = document.querySelector(menuSelector);
  if (!menu) {
    throw new Error(
      `Element with selector '${menuSelector}' could not be found`,
    );
  }
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', containerId);
    menu.appendChild(container);
  }
  return container;
}
