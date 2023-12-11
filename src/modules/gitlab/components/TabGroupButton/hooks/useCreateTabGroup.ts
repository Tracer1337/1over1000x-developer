import { sendExtensionMessage } from 'shared/bridge';
import query from 'shared/query';

export function useCreateTabGroup() {
  const createTabGroup = () => {
    const title = query('gitlab.issue.title');
    const mrUrl = query('gitlab.issue.mr-url');
    const issueId = query('gitlab.issue.id');
    if (!title || !issueId) {
      return;
    }
    sendExtensionMessage('tab-group.create', {
      title,
      issueUrl: window.location.href,
      mrUrl,
      issueId,
    });
  };

  return createTabGroup;
}
