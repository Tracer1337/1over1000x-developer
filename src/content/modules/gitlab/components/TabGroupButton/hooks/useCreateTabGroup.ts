import { Event, senderId } from 'shared/bridge';
import { queryIssueMRUrl, queryIssueTitle } from 'shared/query';

export function useCreateTabGroup() {
  const createTabGroup = () => {
    const title = queryIssueTitle();
    const mrUrl = queryIssueMRUrl();
    if (!title || !mrUrl) {
      return;
    }
    const event: Event = {
      senderId,
      event: 'create-tab-group',
      data: { title, mrUrl },
    };
    chrome.runtime.sendMessage(event);
  };

  return createTabGroup;
}
