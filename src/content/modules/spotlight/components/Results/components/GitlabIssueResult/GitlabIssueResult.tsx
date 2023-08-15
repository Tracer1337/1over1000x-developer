import { Paper, Box, Typography } from '@mui/material';
import { SpotlightResult } from 'content/modules/spotlight/results';
import { useAction } from './hooks/useAction';

export function GitlabIssueResult({
  result,
  selected,
  onClose,
}: {
  result: Extract<SpotlightResult, { type: 'gitlab-issue' }>;
  selected: boolean;
  onClose: () => void;
}) {
  const href = `https://gitlab.dzh.hamburg/theraos/app/-/issues/${result.data.issueId}`;

  useAction({ active: selected, href, callback: onClose });

  return (
    <Paper
      variant="outlined"
      sx={{ height: 56, p: 2, display: 'flex' }}
      component="a"
      href={href}
      target="_blank"
    >
      <Box
        component="img"
        src="https://about.gitlab.com/images/press/logo/svg/gitlab-logo-500.svg"
        sx={{ width: 48, my: -2, ml: -1, mr: 1 }}
      />
      <Typography>Issue #{result.data.issueId}</Typography>
    </Paper>
  );
}
