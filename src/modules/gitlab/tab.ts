import React from 'react';
import { createRoot } from 'react-dom/client';
import { shouldHandleElement } from 'lib/dom';
import TabGroupButton from './components/TabGroupButton';

export function setupTabHelper() {
  render();
}

function render() {
  const container = createContainer();
  if (container) {
    createRoot(container).render(React.createElement(TabGroupButton));
  }
}

function createContainer() {
  const menu = document.querySelector(
    '#new-actions-header-dropdown .gl-dropdown-contents',
  );
  if (!menu || !shouldHandleElement(menu)) {
    return;
  }
  const container = document.createElement('li');
  container.setAttribute('role', 'presentation');
  container.classList.add('gl-dropdown-item');
  menu.appendChild(container);
  return container;
}
