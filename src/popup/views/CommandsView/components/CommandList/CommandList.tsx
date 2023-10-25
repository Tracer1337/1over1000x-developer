import { List, ListItem, IconButton, ListItemText } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { commandDefs } from 'shared/types';
import { sendExtensionMessage } from 'shared/bridge';

export function CommandList() {
  return (
    <List>
      {commandDefs.map((command) => (
        <ListItem
          key={command.key}
          sx={{ px: 3 }}
          secondaryAction={
            <IconButton
              onClick={() => sendExtensionMessage(`command.${command.key}`)}
            >
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
