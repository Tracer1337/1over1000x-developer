import { createElement } from 'react';
import { useParams, useLocation, Redirect } from 'wouter';
import { Box, Stack, Typography } from '@mui/material';
import PushPinIcon from '@mui/icons-material/PushPin';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import views from 'popup/views';
import { useSavedLocation } from 'shared/dom';
import { StorageKeys } from 'shared/storage';

export function ViewRenderer() {
  const { index } = useParams();
  const [, setLocation] = useLocation();
  const { saveLocation, isSavedLocation, clearSavedLocation } =
    useSavedLocation(StorageKeys.POPUP_LOCATION);

  const view = views[parseInt(index ?? '0')];

  if (!view) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ opacity: 0.67, mb: 2 }}
      >
        <Stack direction="row" alignItems="center">
          <Box
            sx={{ cursor: 'pointer', display: 'flex', mr: 2 }}
            onClick={() => setLocation('/')}
          >
            <ChevronLeftIcon />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {view.title}
          </Typography>
        </Stack>
        <Box
          sx={{ cursor: 'pointer', display: 'flex' }}
          onClick={() =>
            isSavedLocation ? clearSavedLocation() : saveLocation()
          }
        >
          <PushPinIcon
            color={isSavedLocation ? 'secondary' : 'inherit'}
            fontSize="small"
          />
        </Box>
      </Stack>
      {createElement(view.component)}
    </>
  );
}