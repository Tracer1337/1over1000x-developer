import { Paper, Typography } from '@mui/material';
import { SpotlightResult } from 'content/modules/spotlight/results';
import { loadForm } from 'shared/form';
import { Settings } from 'shared/storage';
import { useAction } from '../../hooks/useAction';

export function FormResult({
  settings,
  result,
  selected,
  onClose,
}: {
  settings: Settings;
  result: Extract<SpotlightResult, { type: 'form' }>;
  selected: boolean;
  onClose: () => void;
}) {
  const action = useAction({
    active: selected,
    callback: () => {
      loadForm(result.data.form);
      onClose();
    },
  });

  return (
    <Paper
      variant="outlined"
      sx={{ height: 32, p: 2, display: 'flex', alignItems: 'center' }}
      component="a"
      href="#"
      onClick={action}
    >
      <Typography>{result.data.form.label}</Typography>
    </Paper>
  );
}
