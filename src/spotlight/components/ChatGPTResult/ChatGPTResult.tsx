import { Box, Paper, Typography } from '@mui/material';
import { Event, senderId } from 'shared/bridge';
import { useSpotlight } from '../Spotlight/context';

export function ChatGPTResult() {
  const { input, onClose } = useSpotlight();

  const onClick = async () => {
    const event: Event = {
      senderId,
      type: 'chatgpt.open',
      data: { prompt: input },
    };
    await chrome.runtime.sendMessage(event);
    onClose();
  };

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
      onClick={onClick}
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
