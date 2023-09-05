import { Paper, Typography } from '@mui/material';
import { SpotlightResult } from 'content/modules/spotlight/results';
import { useAction } from '../../hooks/useAction';
import { Event, senderId } from 'shared/bridge';

export function CommandResult({
  result,
  selected,
  onClose,
}: {
  result: Extract<SpotlightResult, { type: 'command' }>;
  selected: boolean;
  onClose: () => void;
}) {
  const action = useAction({
    active: selected,
    callback: () => {
      const event: Event = {
        senderId,
        type: `command.${result.data.command.key}`,
      };
      chrome.runtime.sendMessage(event);
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
      <Typography>{result.data.command.label}</Typography>
    </Paper>
  );
}
