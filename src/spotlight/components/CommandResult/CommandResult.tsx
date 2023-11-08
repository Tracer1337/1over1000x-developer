import { Paper, Typography } from '@mui/material';
import { Event, senderId } from 'shared/bridge';
import { useSpotlight } from '../Spotlight/context';
import { commandDefs } from 'shared/types';

export function CommandResult({
  command,
}: {
  command: (typeof commandDefs)[number];
}) {
  const { onClose } = useSpotlight();

  const onClick = async () => {
    const event: Event = {
      senderId,
      type: `command.${command.key}`,
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
      <Typography>{command.label}</Typography>
    </Paper>
  );
}
