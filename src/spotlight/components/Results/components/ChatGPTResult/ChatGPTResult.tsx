import { Box, Paper, Typography } from '@mui/material';
import { useAction } from '../../hooks/useAction';
import { ResultComponent } from '../../types';

const ChatGPTResult: ResultComponent<'chatgpt'> = ({
  settings: _settings,
  result,
  selected,
  onClose,
}) => {
  const action = useAction({
    active: selected,
    callback: () => {
      onClose();
    },
  });

  return (
    <Paper
      variant="outlined"
      sx={{ height: 56, p: 2, display: 'flex', alignItems: 'center' }}
      component="a"
      href="#"
      onClick={action}
    >
      <Box
        component="img"
        src={chrome.runtime.getURL('/assets/chatgpt-logo.svg')}
        sx={{ width: 28, ml: 0.25, mr: 2.25 }}
      />
      <Typography>ChatGPT</Typography>
    </Paper>
  );
};

ChatGPTResult.wrapperProps = {
  sx: {
    width: 'calc(50% - 4px)',
  },
};

export { ChatGPTResult };
