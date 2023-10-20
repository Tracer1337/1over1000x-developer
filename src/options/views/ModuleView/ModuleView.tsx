import { FormEvent, useState } from 'react';
import {
  Alert,
  CircularProgress,
  Snackbar,
  Stack,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSubmit } from './hooks/useSubmit';
import { useModuleForm } from './hooks/useModuleForm';
import { moduleDefs } from 'shared/types';

export function ModuleView({ module }: { module: (typeof moduleDefs)[number] }) {
  const [host, setHost] = useState('');
  const { submit, snackbar } = useSubmit(module.key);
  const { hosts, addHost, removeHost, isLoading } =
    useModuleForm(module.key, submit);

  const handleSubmit = (event?: FormEvent) => {
    event?.preventDefault()
    addHost(host);
    setHost('');
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1} component="form" onSubmit={handleSubmit}>
        <TextField
          value={host}
          onChange={(event) => setHost(event.currentTarget.value)}
          label="Host"
          fullWidth
          autoComplete="off"
          helperText={`Enter a website where you want to use the ${module.key} module`}
        />
        <IconButton
          type="submit"
          sx={{ width: 56, height: 56 }}
          disabled={host.length === 0}
        >
          <AddIcon />
        </IconButton>
      </Stack>
      <List>
        {hosts.map((host, index) => (
          <Paper variant="outlined" key={index} sx={{ mb: 1 }}>
            <ListItem
              secondaryAction={
                <IconButton onClick={() => removeHost(index)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={host} />
            </ListItem>
          </Paper>
        ))}
      </List>
      <Snackbar
        {...snackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={snackbar.onClose}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          Settings saved
        </Alert>
      </Snackbar>
    </Stack>
  );
}
