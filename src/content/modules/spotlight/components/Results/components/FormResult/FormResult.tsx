import { Paper, Typography } from '@mui/material';
import { SpotlightResult } from 'content/modules/spotlight/results';
import { useAction } from '../../hooks/useAction';
import { loadForm } from 'shared/form';

export function FormResult({
  result,
  selected,
  onClose,
}: {
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
