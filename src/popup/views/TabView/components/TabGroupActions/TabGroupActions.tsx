import { Button, IconButton } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { TabGroup } from 'shared/storage';

export function TabGroupActions({
  selection,
  expand,
  onRemove,
  onExpand,
  onOpenTabs,
}: {
  selection: TabGroup;
  expand: boolean;
  onRemove: () => void;
  onExpand: (expand: boolean) => void;
  onOpenTabs: () => void;
}) {
  return (
    <>
      <Button onClick={onOpenTabs} variant="contained" sx={{ mr: 2 }}>
        Open {selection.tabs.length} Tabs
      </Button>
      <IconButton onClick={onRemove}>
        <DeleteOutlineIcon />
      </IconButton>
      <IconButton onClick={() => onExpand(!expand)}>
        {expand ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </IconButton>
    </>
  );
}
