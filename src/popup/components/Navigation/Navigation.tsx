import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import views from 'popup/views';

export function Navigation({ onChange }: { onChange: (tab: number) => void }) {
  return (
    <List>
      {views.map((view, i) => (
        <ListItem disablePadding key={i}>
          <ListItemButton onClick={() => onChange(i)}>
            <ListItemIcon>{React.createElement(view.icon)}</ListItemIcon>
            <ListItemText primary={view.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
