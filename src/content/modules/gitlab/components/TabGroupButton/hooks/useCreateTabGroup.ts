import { Event, senderId } from 'shared/bridge';
import {
  queryIssueMRUrl,
  queryIssueNumber,
  queryIssueTitle,
} from 'shared/query';

export function useCreateTabGroup() {
  const createTabGroup = () => {
    const title = queryIssueTitle();
    const mrUrl = queryIssueMRUrl();
    const issueId = queryIssueNumber();
    if (!title || !issueId) {
      return;
    }
    const event: Event = {
      senderId,
      event: 'create-tab-group',
      data: { title, mrUrl, issueId },
    };
    chrome.runtime.sendMessage(event);
  };

  return createTabGroup;
}
