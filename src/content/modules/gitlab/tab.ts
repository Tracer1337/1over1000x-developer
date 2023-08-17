import React from 'react';
import { createRoot } from 'react-dom/client';
import { shouldHandleElement } from 'shared/dom';
import TabGroupButton from './components/TabGroupButton';

const menuSelector = '#new-actions-header-dropdown .gl-dropdown-contents';
const containerId = 'tab-helper';

export function setupTabHelper() {
  render();
}

function render() {
  const container = getContainer();
  if (shouldHandleElement(container)) {
    createRoot(container).render(React.createElement(TabGroupButton));
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
    container = document.createElement('li');
    container.setAttribute('id', containerId);
    container.setAttribute('role', 'presentation');
    container.classList.add('gl-dropdown-item');
    menu.appendChild(container);
  }
  return container;
}
