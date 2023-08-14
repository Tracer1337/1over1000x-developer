import { Typography } from '@mui/material';
import { useCurrentRef } from './hooks/useCurrentRef';

function CurrentRef() {
  const currentRef = useCurrentRef();

  return (
    <Typography variant="caption" sx={{ opacity: 0.5 }}>
      {currentRef}
    </Typography>
  );
}

export default CurrentRef;
