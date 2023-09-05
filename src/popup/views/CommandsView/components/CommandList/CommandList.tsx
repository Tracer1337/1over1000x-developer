import { List, ListItem, IconButton, ListItemText } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { commandDefs } from 'shared/types';
import { Event, senderId } from 'shared/bridge';

export function CommandList() {
  const runCommand = (command: (typeof commandDefs)[number]) => {
    const event: Event = {
      senderId,
      type: `command.${command.key}`,
    };
    chrome.runtime.sendMessage(event);
  };

  return (
    <List>
      {commandDefs.map((command) => (
        <ListItem
          key={command.key}
          sx={{ px: 3 }}
          secondaryAction={
            <IconButton onClick={() => runCommand(command)}>
              <PlayArrowIcon />
            </IconButton>
          }
        >
          <ListItemText primary={command.label} />
        </ListItem>
      ))}
    </List>
  );
}
