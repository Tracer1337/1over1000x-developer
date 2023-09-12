import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  getOrCreateContainer,
  shouldHandleElement,
  withShadowRoot,
} from 'shared/dom';
import {
  StorageKeys,
  UserStory,
  addStorageValueListener,
  loadStorageValue,
  saveStorageValue,
} from 'shared/storage';
import query from 'shared/query';
import IssueActions from './components/IssueActions';
import LoadingIndicator from './components/LoadingIndicator';

let removeLoadingIndicator: (() => void) | null = null;

export function setupIssueActions() {
  if (location.pathname.endsWith('new')) {
    loadStorageValue(StorageKeys.USER_STORY).then(handleUserStoryChange);
    return addStorageValueListener(
      StorageKeys.USER_STORY,
      handleUserStoryChange,
    );
  }
  renderIsssueActions();
}

async function handleUserStoryChange(userStory: UserStory | null) {
  if (!userStory) {
    return;
  }
  if (userStory.loading) {
    return renderLoadingIndicator();
  }
  removeLoadingIndicator?.();
  injectUserStory(userStory);
  saveStorageValue(StorageKeys.USER_STORY, null);
}

function renderIsssueActions() {
  const container = getOrCreateContainer(
    'issue-actions',
    '#new-actions-header-dropdown .gl-dropdown-contents',
  );
  if (shouldHandleElement(container)) {
    createRoot(container).render(React.createElement(IssueActions));
  }
}

function renderLoadingIndicator() {
  const container = getOrCreateContainer('issue-loading-indicator');
  if (shouldHandleElement(container)) {
    container.style.position = 'absolute';
    container.style.top = '0';
    const root = createRoot(container);
    root.render(
      withShadowRoot(container, React.createElement(LoadingIndicator)),
    );
    removeLoadingIndicator = () => {
      root.unmount();
      removeLoadingIndicator = null;
    };
  }
}

function injectUserStory(userStory: UserStory) {
  if (!userStory.data) {
    throw new Error('Missing data on user-story object');
  }

  const title = query('gitlab.issue.title-input');
  const description = query('gitlab.issue.description-input');

  if (!title || !description) {
    throw new Error('Could not find input fields');
  }

  title.value = userStory.data.title;
  description.value = createIssueDescription(userStory.data);
  const changeEvent = new Event('change');
  description.dispatchEvent(changeEvent);
}

function createIssueDescription(data: NonNullable<UserStory['data']>) {
  return `## User Story
${data.description}

## Kontext
- ...

## Akzeptanzkriterien
- [ ] **Responsivität** berücksichtigen
- [ ] **Behat** - 1 Happy-Path implementieren oder bestehende/n Test/s anpassen - Folgestory für weitere Tests: \`#<iid>\`
- [ ] **Cypress** - 1 Happy-Path implementieren oder bestehende/n Test/s anpassen - Folgestory für weitere Tests: \`#<iid>\`
- [ ] **DSGVO** - Anonymisieren und Löschcommand sind ggf. erweitert und erfolgreich ausführbar
${data.criteria.map((text) => `- [ ] ${text}`).join('\n')}

## Technische Details
- ...`;
}
