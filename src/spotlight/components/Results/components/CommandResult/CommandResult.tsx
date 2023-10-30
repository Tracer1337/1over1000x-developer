import { Paper, Typography } from '@mui/material';
import { Event, senderId } from 'shared/bridge';
import { Settings } from 'shared/storage';
import { SpotlightResult } from 'spotlight/components/Spotlight/results';
import { useAction } from '../../hooks/useAction';

export function CommandResult({
  settings,
  result,
  selected,
  onClose,
}: {
  settings: Settings;
  result: Extract<SpotlightResult, { type: 'command' }>;
  selected: boolean;
  onClose: () => void;
}) {
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
      sx={{ height: 56, p: 2, display: 'flex', alignItems: 'center' }}
      component="a"
      href="#"
      onClick={action}
    >
      <Typography>{result.data.command.label}</Typography>
    </Paper>
  );
}
