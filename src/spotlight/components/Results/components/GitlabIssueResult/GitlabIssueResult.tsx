import { Paper, Box, Typography, Stack, alpha } from '@mui/material';
import { useAction } from '../../hooks/useAction';
import { ResultComponent } from '../../types';

const GitlabIssueResult: ResultComponent<'gitlab-issue'> = ({
  settings,
  result,
  selected,
  onClose,
}) => {
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
      sx={{
        height: 56,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
      component="a"
      href="#"
      onClick={action}
    >
      <Box
        component="img"
        src={chrome.runtime.getURL('/assets/gitlab-logo.svg')}
        sx={{ width: 48, my: -2, ml: -1, mr: 1 }}
      />
      {result.data.title ? (
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            #{result.data.issueId}
          </Typography>
          <Typography
            variant="body2"
            sx={(theme) => ({
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: 250,
              color: alpha(theme.palette.text.primary, 0.67),
            })}
          >
            {result.data.title}
          </Typography>
        </Stack>
      ) : (
        <Typography>Issue #{result.data.issueId}</Typography>
      )}
    </Paper>
  );
};

GitlabIssueResult.wrapperProps = {
  sx: {
    width: '100%',
  },
};

export { GitlabIssueResult };
