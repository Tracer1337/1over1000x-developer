import { useState } from 'react';
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
import { useSpotlightForm } from './hooks/useForm';

export function SpotlightView() {
  const [host, setHost] = useState('');
  const { submit, snackbar } = useSubmit();
  const { spotlightHosts, addSpotlightHost, removeSpotlightHost, isLoading } =
    useSpotlightForm(submit);

  const handleAddClick = () => {
    addSpotlightHost(host);
    setHost('');
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1}>
        <TextField
          value={host}
          onChange={(event) => setHost(event.currentTarget.value)}
          label="Host"
          fullWidth
          helperText="Enter a website where you want to use Spotlight"
        />
        <IconButton
          onClick={handleAddClick}
          sx={{ width: 56, height: 56 }}
          disabled={host.length === 0}
        >
          <AddIcon />
        </IconButton>
      </Stack>
      <List>
        {spotlightHosts.map((host, index) => (
          <Paper variant="outlined" key={index} sx={{ mb: 1 }}>
            <ListItem
              secondaryAction={
                <IconButton onClick={() => removeSpotlightHost(index)}>
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
