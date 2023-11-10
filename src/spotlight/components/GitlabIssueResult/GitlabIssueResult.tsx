import { Paper, Box, Typography, Stack, alpha } from '@mui/material';

export function GitlabIssueResult({
  id,
  action,
  title,
  issueId,
}: {
  id: string;
  action: () => void;
  title?: string;
  issueId: number;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: 56,
        width: '100%',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
      component="a"
      href="#"
      onClick={action}
      data-focusable
      data-result-id={id}
    >
      <Box
        component="img"
        src={chrome.runtime.getURL('/assets/gitlab-logo.svg')}
        sx={{ width: 48, my: -2, ml: -1, mr: 1 }}
      />
      {title ? (
        <Stack>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            #{issueId}
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
            {title}
          </Typography>
        </Stack>
      ) : (
        <Typography>Issue #{issueId}</Typography>
      )}
    </Paper>
  );
}
