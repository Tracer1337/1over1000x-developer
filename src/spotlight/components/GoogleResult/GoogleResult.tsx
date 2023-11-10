import { Box, Paper, Typography } from '@mui/material';

export function GoogleResult({
  id,
  action,
}: {
  id: string;
  action: () => void;
}) {
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
      data-focusable
      data-result-id={id}
    >
      <Box
        component="img"
        src={chrome.runtime.getURL('/assets/google-logo.svg')}
        sx={{ width: 24, ml: 0.5, mr: 2.5 }}
      />
      <Typography>Google</Typography>
    </Paper>
  );
}
