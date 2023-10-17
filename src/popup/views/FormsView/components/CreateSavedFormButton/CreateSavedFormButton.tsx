import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { usePageInfo } from 'shared/bridge';
import { useSaveForm } from './hooks/useSaveForm';

export function CreateSavedFormButton() {
  const pageInfo = usePageInfo();
  const saveForm = useSaveForm();

  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      disabled={!pageInfo?.hasForm}
      onClick={saveForm}
    >
      Save Current Form
    </Button>
  );
}
