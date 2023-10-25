import { Paper, Box, Typography } from '@mui/material';
import { SpotlightResult } from 'content/modules/spotlight/results';
import { Settings } from 'shared/storage';
import { useAction } from '../../hooks/useAction';

export function GitlabIssueResult({
  settings,
  result,
  selected,
  onClose,
}: {
  settings: Settings;
  result: Extract<SpotlightResult, { type: 'gitlab-issue' }>;
  selected: boolean;
  onClose: () => void;
}) {
  const { host, project } = settings.modules.gitlab.config;

  const href = `https://${host}${project}/-/issues/${result.data.issueId}`;

  const action = useAction({
    active: selected,
    callback: () => {
      window.open(href, '_blank');
      onClose();
    },
  });

  return (
    <Paper
      variant="outlined"
      sx={{ height: 32, p: 2, display: 'flex', alignItems: 'center' }}
      component="a"
      href="#"
      onClick={action}
    >
      <Box
        component="img"
        src={chrome.runtime.getURL('/assets/gitlab-logo.svg')}
        sx={{ width: 48, my: -2, ml: -1, mr: 1 }}
      />
      <Typography>Issue #{result.data.issueId}</Typography>
    </Paper>
  );
}
