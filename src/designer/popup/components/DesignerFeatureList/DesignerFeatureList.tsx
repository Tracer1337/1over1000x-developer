import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
} from '@mui/material';
import Grid3x3 from '@mui/icons-material/Grid3x3';
import StraightenIcon from '@mui/icons-material/Straighten';
import { useToggleFeature } from './hooks/useToggleFeature';
import { useStorageValue } from 'shared/storage';
import { DESIGNER_STORAGE_KEY, designerStorageDefaultValue } from 'designer';

export function DesignerFeatureList() {
  const designerStorage =
    useStorageValue(DESIGNER_STORAGE_KEY)[0] ?? designerStorageDefaultValue;

  const toggleFeature = useToggleFeature();

  if (!designerStorage) {
    return;
  }

  return (
    <List sx={{ mx: -2 }}>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 48 }}>
          <Grid3x3 />
        </ListItemIcon>
        <ListItemText primary="Guides" />
        <Switch
          edge="end"
          onChange={() => toggleFeature('guides')}
          checked={designerStorage.features.guides}
        />
      </ListItem>
      <ListItem>
        <ListItemIcon sx={{ minWidth: 48 }}>
          <StraightenIcon />
        </ListItemIcon>
        <ListItemText primary="Measure" />
        <Switch
          edge="end"
          onChange={() => toggleFeature('measure')}
          checked={designerStorage.features.measure}
        />
      </ListItem>
    </List>
  );
}
