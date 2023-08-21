import React from 'react';
import { createRoot } from 'react-dom/client';
import { createRenderLoop } from 'shared/bridge';
import { shouldHandleElement } from 'shared/dom';
import FileActions from './components/FileActions';

export function setupFileHelper() {
  return createRenderLoop(render);
}

function render() {
  Array.from(document.querySelectorAll<HTMLElement>('.diff-file'))
    .filter(shouldHandleElement)
    .forEach(renderFileHelper);
}

function renderFileHelper(file: HTMLElement) {
  const container = getFileActionContainer(file);
  createRoot(container).render(
    React.createElement(FileActions, {
      path: () => file.dataset.path as string,
    }),
  );
}

function getFileActionContainer(file: HTMLElement) {
  const menu = file.querySelector('ul[role="menu"]');
  if (!menu) {
    throw new Error(
      `Element with selector 'ul[role="menu"]' could not be found`,
    );
  }
  const sibling = menu.querySelector('.gl-dropdown-item:nth-child(3)');
  if (!sibling) {
    throw new Error(
      `Element with selector ".gl-dropdown-item:nth-child(3)" could not be found`,
    );
  }
  const container = document.createElement('div');
  sibling.after(container);
  return container;
}
