import { Paper, Typography } from '@mui/material';
import { Event, senderId } from 'shared/bridge';
import { useAction } from '../../hooks/useAction';
import { ResultComponent } from '../../types';

const CommandResult: ResultComponent<'command'> = ({
  settings: _settings,
  result,
  selected,
  onClose,
}) => {
  const action = useAction({
    active: selected,
    callback: async () => {
      const event: Event = {
        senderId,
        type: `command.${result.data.command.key}`,
      };
      await chrome.runtime.sendMessage(event);
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
      <Typography>{result.data.command.label}</Typography>
    </Paper>
  );
};

CommandResult.wrapperProps = {
  sx: {
    width: '100%',
  },
};

export { CommandResult };
