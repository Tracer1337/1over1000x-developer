import { Backdrop, CircularProgress } from '@mui/material';
import { useDisableScroll } from './hooks/useDisableScroll';

export function LoadingIndicator() {
  useDisableScroll();

  return (
    <Backdrop sx={{ color: 'white', zIndex: 999999 }} open>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
