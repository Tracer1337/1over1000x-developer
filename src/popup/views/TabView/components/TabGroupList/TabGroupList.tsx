import { Fragment, useState } from 'react';
import {
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Stack,
} from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { TabGroup } from 'shared/storage';
import { openTabGroup, removeTabGroup } from 'shared/tab';

export function TabGroupList({ tabGroups }: { tabGroups: TabGroup[] }) {
  const confirm = useConfirm();
  const [expand, setExpand] = useState<TabGroup | null>(null);

  const handleRemove = (group: TabGroup) =>
    confirm({ description: `'${group.name}' will be removed` }).then(() =>
      removeTabGroup(tabGroups.indexOf(group)),
    );

  return (
    <List>
      {tabGroups.map((group, index) => (
        <Fragment key={index}>
          <ListItem sx={{ pl: 3 }}>
            <ListItemText primary={group.name} />
            <Stack direction="row" gap={0.5}>
              <IconButton onClick={() => handleRemove(group)}>
                <RemoveIcon />
              </IconButton>
              <IconButton
                onClick={() => setExpand(expand === group ? null : group)}
              >
                {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <IconButton onClick={() => openTabGroup(group)}>
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          </ListItem>
          <Collapse in={expand === group} timeout="auto" unmountOnExit>
            <List component="div" disablePadding dense>
              {group.tabs.map((tab, index) => (
                <ListItem sx={{ pl: 5 }} key={index}>
                  <ListItemText primary={new URL(tab.url).hostname} />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Fragment>
      ))}
    </List>
  );
}
