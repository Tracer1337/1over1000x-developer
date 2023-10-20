import React from 'react';
import {
  Switch,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useModules } from './hooks/useModules';
import { moduleDefs } from 'shared/types';

export function ModulePicker() {
  const [modules, toggleModule] = useModules();

  if (!modules) {
    return;
  }

  return (
    <List sx={{ mx: -2 }}>
      {moduleDefs.map(({ key, label, icon }) => (
        <ListItem key={key}>
          <ListItemIcon sx={{ minWidth: 48 }}>
            {React.createElement(icon)}
          </ListItemIcon>
          <ListItemText primary={label} />
          <Switch
            edge="end"
            onChange={() => toggleModule(key)}
            checked={modules[key].enabled}
          />
        </ListItem>
      ))}
    </List>
  );
}
