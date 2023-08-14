import { Event, senderId } from 'shared/bridge';

export function useCreateTabGroup() {
  const createTabGroup = () => {
    const event: Event = {
      senderId,
      event: 'create-tab-group',
      data: { title: getTitle(), mrUrl: getMrUrl() },
    };
    chrome.runtime.sendMessage(event);
  };

  const getTitle = () => {
    const titleElement = document.querySelector('h1');
    return titleElement?.textContent?.slice(0, 10) ?? '';
  };

  const getMrUrl = () => {
    const mrLink = document.querySelector(
      '.js-issue-widgets .card ul.related-items-list li:last-child a',
    );
    return mrLink?.getAttribute('href') ?? undefined;
  };

  return createTabGroup;
}
