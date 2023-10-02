import { useState } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateTabGroupDialog from '../CreateTabGroupDialog';

export function CreateTabGroupButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
      >
        Save Current Tabs
      </Button>
      <CreateTabGroupDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
