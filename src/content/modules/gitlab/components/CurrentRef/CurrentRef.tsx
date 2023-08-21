import { Typography } from '@mui/material';
import query from 'shared/query';

function CurrentRef() {
  return (
    <Typography variant="caption" sx={{ opacity: 0.5 }}>
      {query('gitlab.mr-pipeline.current-ref')}
    </Typography>
  );
}

export default CurrentRef;
