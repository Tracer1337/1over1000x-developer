import query from 'shared/query';

export function useStatusMessage() {
  const copyStatusMessage = async () => {
    const statusMessage = createStatusMessage();
    if (!statusMessage) {
      throw new Error('Could not create status message');
    }
    await navigator.clipboard.writeText(statusMessage);
  };

  const createStatusMessage = () => {
    const issueId = query('gitlab.issue.id');
    const issueUrl = location.href;
    const issueTitle = query('gitlab.issue.title');
    const issueStatus = query('gitlab.issue.status');

    if (!issueId || !issueTitle || !issueStatus) {
      return null;
    }

    return `[#${issueId}](${issueUrl}) \`${issueTitle}\` ${issueStatus}`;
  };

  return copyStatusMessage;
}
