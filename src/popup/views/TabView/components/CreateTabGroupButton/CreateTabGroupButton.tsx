import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { saveCurrentTabs } from 'shared/tab';

export function CreateTabGroupButton() {
  const handleClick = () => {
    const name = prompt('Enter a descriptive name');
    if (!name) {
      return;
    }
    saveCurrentTabs(name);
  };

  return (
    <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClick}>
      Save Current Tabs
    </Button>
  );
}
