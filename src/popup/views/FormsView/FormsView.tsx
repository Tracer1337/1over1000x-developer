import { Box, Stack } from '@mui/material';
import CreateSavedFormButton from './components/CreateSavedFormButton';
import FormsList from './components/FormsList';

export function FormsView() {
  return (
    <Stack gap={1}>
      <CreateSavedFormButton />
      <Box sx={{ mx: -3, maxHeight: '236px', overflowY: 'auto' }}>
        <FormsList />
      </Box>
    </Stack>
  );
}
