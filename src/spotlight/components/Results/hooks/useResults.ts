import { useChatGPTResults } from 'spotlight/components/ChatGPTResult/hooks/useChatGPTResults';
import { useCommandResults } from 'spotlight/components/CommandResult/hooks/useCommandResults';
import { useGitlabIssueResults } from 'spotlight/components/GitlabIssueResult/hooks/useGitlabIssueResults';
import { useGoogleResults } from 'spotlight/components/GoogleResult/hooks/useGoogleResults';

export function useResults() {
  return [
    useGoogleResults(),
    useChatGPTResults(),
    useCommandResults(),
    useGitlabIssueResults(),
  ].flat();
}
