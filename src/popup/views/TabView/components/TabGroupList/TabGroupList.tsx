import { Fragment } from 'react';
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { TabGroup } from 'shared/tab';

export function TabGroupList({
  tabGroups,
  selection,
  expand,
  onSelect,
}: {
  tabGroups: TabGroup[];
  selection: TabGroup | null;
  expand: boolean;
  onSelect: (selection: TabGroup | null) => void;
}) {
  return (
    <List>
      {tabGroups.map((group, index) => (
        <Fragment key={index}>
          <ListItemButton
            selected={selection === group}
            onClick={() => onSelect(selection === group ? null : group)}
            sx={{ pl: 3 }}
          >
            <ListItemText primary={group.name} />
          </ListItemButton>
          <Collapse in={expand} timeout="auto" unmountOnExit>
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
