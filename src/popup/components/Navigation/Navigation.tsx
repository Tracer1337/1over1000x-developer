import React from 'react';
import { useLocation } from 'wouter';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { usePopupViews } from 'popup/views';

export function Navigation() {
  const [, setLocation] = useLocation();

  const views = usePopupViews();

  return (
    <List>
      {views.map((view, i) => (
        <ListItem disablePadding key={i}>
          <ListItemButton onClick={() => setLocation(view.path)}>
            <ListItemIcon>{React.createElement(view.icon)}</ListItemIcon>
            <ListItemText primary={view.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
