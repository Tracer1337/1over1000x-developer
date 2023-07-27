import { Box } from '@mui/material';
import CurrentRef from '../CurrentRef';
import RunPipelineButton from '../RunPipelineButton';

function PipelineEnhancements() {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ mr: 2 }}>
        <RunPipelineButton />
      </Box>
      <CurrentRef />
    </Box>
  );
}

export default PipelineEnhancements;
