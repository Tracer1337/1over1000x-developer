import React from 'react';
import { createRoot } from 'react-dom/client';
import { createRenderLoop } from 'shared/bridge';
import { shouldHandleElement } from 'shared/dom';
import query from 'shared/query';
import FileActions from './components/FileActions';
import { match } from 'ts-pattern';

export type FileHelperPages = 'mr-overview' | 'mr-diff';

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
  const path = () =>
    match(getCurrentPage())
      .with(
        'mr-overview',
        () => (file.firstChild as HTMLElement).dataset.qaFileName,
      )
      .with('mr-diff', () => file.dataset.path)
      .exhaustive() as string;
  createRoot(container).render(
    React.createElement(FileActions, { path, page: getCurrentPage() }),
  );
}

function getCurrentPage(): FileHelperPages {
  return location.href.endsWith('diffs') ? 'mr-diff' : 'mr-overview';
}

function getFileActionContainer(file: HTMLElement) {
  const container = document.createElement('div');
  const sibling = match(getCurrentPage())
    .with('mr-overview', () =>
      query('gitlab.mr-overview.thread-file-actions-sibling', file),
    )
    .with('mr-diff', () => query('gitlab.mr-diff.file-actions-sibling', file))
    .exhaustive();
  if (!sibling) {
    throw new Error('No sibling for file actions found');
  }
  sibling.after(container);
  return container;
}
