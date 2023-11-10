import { Box, Paper, Typography } from '@mui/material';

export function ChatGPTResult({
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
        src={chrome.runtime.getURL('/assets/chatgpt-logo.svg')}
        sx={{ width: 28, ml: 0.25, mr: 2.25 }}
      />
      <Typography>ChatGPT</Typography>
    </Paper>
  );
}
