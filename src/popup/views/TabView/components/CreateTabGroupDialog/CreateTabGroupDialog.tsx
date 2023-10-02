import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Typography,
  Stack,
  CardActionArea,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { saveCurrentTabs } from 'shared/tab';

export function CreateTabGroupDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true }).then(setTabs);
  }, []);

  const handleSave = () =>
    saveCurrentTabs(name).then(() => {
      setName('');
      onClose();
    });

  return (
    <Dialog open={open} onClose={onClose} fullScreen transitionDuration={0}>
      <DialogTitle>Save Current Tabs</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          label="Name"
          fullWidth
          variant="outlined"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          sx={{ mt: 1 }}
        />
        <Box sx={{ mt: 2, mx: -1.5 }}>
          <CardActionArea
            onClick={() => setExpand(!expand)}
            sx={{ color: 'GrayText', px: 1.5, py: 1 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>{tabs.length} Tabs</Typography>
              {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Stack>
          </CardActionArea>
          <Collapse in={expand} timeout="auto">
            <List component="div" sx={{ p: 0 }} disablePadding dense>
              {tabs.map((tab, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={tab.url && new URL(tab.url).hostname}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} disabled={name.length === 0}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
