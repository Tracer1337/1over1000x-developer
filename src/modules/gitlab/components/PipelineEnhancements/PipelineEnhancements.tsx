import { Box } from '@mui/material';
import RunPipelineButton from '../RunPipelineButton';

function PipelineEnhancements() {
  return (
    <Box
      sx={{
        py: 2,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}
    >
      <RunPipelineButton />
    </Box>
  );
}

export default PipelineEnhancements;
