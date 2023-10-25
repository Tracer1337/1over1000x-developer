import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { sendExtensionMessage, usePageInfo } from 'shared/bridge';

export function CreateSavedFormButton() {
  const pageInfo = usePageInfo();

  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      disabled={!pageInfo?.hasForm}
      onClick={() => sendExtensionMessage('form.save').toCurrentTab()}
    >
      Save Current Form
    </Button>
  );
}
