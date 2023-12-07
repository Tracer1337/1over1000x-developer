import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import GitHubLoadingIndicator from './components/GitHubLoadingIndicator';

let request: Promise<string> | null = null;

export function setupDashboard() {
  const container = createContainer();
  const removeLoadingIndicator = renderLoadingIndicator(container);
  renderOldDashboard(container).then(removeLoadingIndicator);
}

function createContainer() {
  const dashboard = document.querySelector('#dashboard feed-container');
  const container = document.createElement('div');
  dashboard?.replaceWith(container);
  return container;
}

function renderLoadingIndicator(container: HTMLElement) {
  const root = createRoot(container);
  root.render(
    createElement(GitHubLoadingIndicator, {
      variant: 'octocat',
      sx: { mt: 8 },
    }),
  );
  return () => root.unmount();
}

async function renderOldDashboard(container: HTMLElement) {
  const feedContent = document.querySelector<HTMLElement>('.feed-content');
  const feedMain = document.querySelector<HTMLElement>('.feed-main');
  const sidebar = document.querySelector<HTMLElement>('.feed-right-sidebar');

  if (feedContent) {
    feedContent.style.maxWidth = 'unset';
  }

  if (feedMain) {
    feedMain.style.maxWidth = '100%';
  }

  if (sidebar) {
    sidebar.style.maxWidth = 'unset';
    sidebar.style.width = '900px';
  }

  request ??= fetch('https://github.com/dashboard-feed').then((response) =>
    response.text(),
  );

  const text = await request;
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  const main = doc.querySelector('main');

  if (!main) {
    return;
  }

  container.replaceWith(main);
}
