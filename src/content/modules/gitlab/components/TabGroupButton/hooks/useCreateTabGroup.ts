import { Event, senderId } from 'shared/bridge';
import query from 'shared/query';

export function useCreateTabGroup() {
  const createTabGroup = () => {
    const title = query('gitlab.issue.title');
    const mrUrl = query('gitlab.issue.mr-url');
    const issueId = query('gitlab.issue.id');
    if (!title || !issueId) {
      return;
    }
    const event: Event = {
      senderId,
      type: 'tab-group.create',
      data: {
        title,
        issueUrl: window.location.href,
        mrUrl,
        issueId,
      },
    };
    chrome.runtime.sendMessage(event);
  };

  return createTabGroup;
}
