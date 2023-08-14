import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  shouldHandleElement,
  getOrCreateContainer,
  waitForSelector,
} from 'shared/dom';
import SuggestionButtons from './components/SuggestionButtons';
import { GlobalStyles } from '@mui/material';
import { SuggestionHelperState, suggestionHelperStore } from './store';
import { createRenderLoop } from 'shared/bridge';

export function setupSuggestionHelper() {
  renderGlobalStyles();

  suggestionHelperStore.subscribe((store) => handleStoreUpdate(store));

  return createRenderLoop(render);
}

function render() {
  Array.from(document.querySelectorAll('.diff-grid-row:not(.expansion)'))
    .filter((row) => shouldHandleElement(row))
    .forEach((row) => renderSuggestionHelper(row));
}

function handleStoreUpdate(store: SuggestionHelperState) {
  if (!store.from || !store.to) {
    return;
  }
  getCommentButton(store.from).querySelector('div')?.click();
  const rows = collectRows(store.from, store.to);
  waitForSelector<HTMLTextAreaElement>('#note_note').then((textarea) => {
    textarea.value = createSuggestionText(rows);
    const changeEvent = new Event('change');
    textarea.dispatchEvent(changeEvent);
  });
  store.reset();
}

function collectRows(from: Element, to: Element) {
  const rows: Element[] = [];
  const numberOfRows = getLineNumber(to) - getLineNumber(from);
  let currentElement: Element | null = from;
  for (let i = 0; i < numberOfRows + 1 && currentElement; i++) {
    rows.push(currentElement);
    currentElement = currentElement.nextElementSibling;
  }
  return rows;
}

function createSuggestionText(rows: Element[]) {
  const content = rows
    .map((row) => row.querySelector('.line')?.textContent)
    .join('\n');
  return `\`\`\`suggestion:-0+${rows.length - 1}\n${content}\n\`\`\``;
}

function getRowActionContainer(row: Element) {
  const commentButton = getCommentButton(row);
  const container = document.createElement('div');
  container.classList.add('suggestion-helper');
  commentButton.parentElement?.appendChild(container);
  return container;
}

function getCommentButton(row: Element) {
  const commentButton = row.querySelector<HTMLElement>('.add-diff-note');
  if (!commentButton) {
    throw new Error(
      `Element with selector '.add-diff-note' could not be found`,
    );
  }
  return commentButton;
}

function getLineNumber(row: Element) {
  const anchorElement = row.querySelector('a[data-linenumber]');
  if (!anchorElement) {
    throw new Error(
      `Element with selector 'a[data-linenumber]' could not be found`,
    );
  }
  return parseInt(anchorElement.getAttribute('data-linenumber') ?? '-1');
}

function renderGlobalStyles() {
  const container = getOrCreateContainer('suggestion-helper-global-styles');
  if (!shouldHandleElement(container)) {
    return;
  }
  createRoot(container).render(
    React.createElement(GlobalStyles, {
      styles: {
        '.suggestion-helper': {
          display: 'none',
        },
        '.diff-file .diff-grid-left:hover .suggestion-helper': {
          display: 'block',
        },
      },
    }),
  );
}

function renderSuggestionHelper(row: Element) {
  createRoot(getRowActionContainer(row)).render(
    React.createElement(SuggestionButtons, { row }),
  );
}
