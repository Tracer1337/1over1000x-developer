import { Paper, Typography } from '@mui/material';
import { SpotlightResult } from 'content/modules/spotlight/results';
import { Event, sendExtensionMessage, senderId } from 'shared/bridge';
import { Settings } from 'shared/storage';
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
    callback: () => {
      sendExtensionMessage(`command.${result.data.command.key}`);
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
