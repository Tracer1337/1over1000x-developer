export type SpotlightResult = {
  type: 'gitlab-issue';
  id: string;
  data: {
    issueId: number;
  };
};

export function generateResults(input: string) {
  const results: SpotlightResult[] = [];
  results.push(...generateGitlabIssueResults(input));
  return results;
}

function generateGitlabIssueResults(
  input: string,
): Extract<SpotlightResult, { type: 'gitlab-issue' }>[] {
  const ids = input.match(/\b\d{4}\b/g)?.map((id) => parseInt(id)) ?? [];
  const distinctIds = Array.from(new Set(ids));
  return distinctIds.map((id) => ({
    type: 'gitlab-issue',
    id: `gitlab-issue-${id}`,
    data: { issueId: id },
  }));
}
