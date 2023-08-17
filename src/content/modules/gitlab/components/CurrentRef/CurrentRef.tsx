import { Typography } from '@mui/material';
import { queryCurrentRef } from 'shared/query';

function CurrentRef() {
  return (
    <Typography variant="caption" sx={{ opacity: 0.5 }}>
      {queryCurrentRef()}
    </Typography>
  );
}

export default CurrentRef;
