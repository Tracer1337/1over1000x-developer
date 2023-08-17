import {
  queryIssueNumber,
  queryIssueStatus,
  queryIssueTitle,
} from 'shared/query';

export function useStatusMessage() {
  const copyStatusMessage = async () => {
    const statusMessage = createStatusMessage();
    if (!statusMessage) {
      throw new Error('Could not create status message');
    }
    await navigator.clipboard.writeText(statusMessage);
  };

  const createStatusMessage = () => {
    const issueNumber = queryIssueNumber();
    const issueUrl = location.href;
    const issueTitle = queryIssueTitle();
    const issueStatus = queryIssueStatus();

    if (!issueNumber || !issueTitle || !issueStatus) {
      return null;
    }

    return `[#${issueNumber}](${issueUrl}) \`${issueTitle}\` ${issueStatus}`;
  };

  return copyStatusMessage;
}
