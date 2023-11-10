import { Paper, Typography } from '@mui/material';
import { commandDefs } from 'shared/types';

export function CommandResult({
  id,
  action,
  command,
}: {
  id: string;
  action: () => void;
  command: (typeof commandDefs)[number];
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: 56,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
      component="a"
      href="#"
      onClick={action}
      data-focusable
      data-result-id={id}
    >
      <Typography>{command.label}</Typography>
    </Paper>
  );
}
