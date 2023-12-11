import React from 'react';
import { createRoot } from 'react-dom/client';
import { match } from 'ts-pattern';
import query from 'shared/query';
import { createRenderLoop } from 'shared/bridge';
import { resetHandledElementMarkers, shouldHandleElement } from 'shared/dom';
import FileActions from '../components/FileActions';

export type FileHelperPages = 'mr-overview' | 'mr-diff';

const containerClassName = 'chrome-extension-file-actions';

export function setupFileHelper() {
  const observers: MutationObserver[] = [];
  const destroyRenderLoop = createRenderLoop(() =>
    observers.push(
      ...Array.from(document.querySelectorAll<HTMLElement>('.diff-file'))
        .filter(shouldHandleElement)
        .map(attachFileActions)
        .filter((observer): observer is MutationObserver => observer !== null),
    ),
  );
  return () => {
    destroyRenderLoop();
    resetHandledElementMarkers();
    observers.forEach((observer) => observer.disconnect());
  };
}

function attachFileActions(file: HTMLElement) {
  const menu = getFileMenu(file);
  if (!menu) {
    return null;
  }
  renderFileActions(file);
  const observer = new MutationObserver(() => renderFileActions(file));
  observer.observe(menu, { childList: true });
  return observer;
}

function renderFileActions(file: HTMLElement) {
  if (hasFileActions(file)) {
    return;
  }
  const container = getFileActionContainer(file);
  if (!container) {
    return;
  }
  createRoot(container).render(
    React.createElement(FileActions, {
      path: getFilePathQuery(file),
      page: getCurrentPage(),
    }),
  );
}

function hasFileActions(file: HTMLElement) {
  return file.querySelector(`.${containerClassName}`) !== null;
}

function getCurrentPage(): FileHelperPages {
  return location.href.endsWith('diffs') ? 'mr-diff' : 'mr-overview';
}

function getFileMenu(file: HTMLElement) {
  return match(getCurrentPage())
    .with('mr-overview', () =>
      query('gitlab.mr-overview.thread-file-menu', file),
    )
    .with('mr-diff', () => query('gitlab.mr-diff.file-menu', file))
    .exhaustive();
}

function getFileActionContainer(file: HTMLElement) {
  const container = document.createElement('div');
  container.classList.add(containerClassName);
  const sibling = match(getCurrentPage())
    .with('mr-overview', () =>
      query('gitlab.mr-overview.thread-file-actions-sibling', file),
    )
    .with('mr-diff', () => query('gitlab.mr-diff.file-actions-sibling', file))
    .exhaustive();
  if (!sibling) {
    return null;
  }
  sibling.after(container);
  return container;
}

function getFilePathQuery(file: HTMLElement) {
  return () =>
    match(getCurrentPage())
      .with(
        'mr-overview',
        () => (file.firstChild as HTMLElement).dataset.qaFileName,
      )
      .with('mr-diff', () => file.dataset.path)
      .exhaustive() as string;
}
