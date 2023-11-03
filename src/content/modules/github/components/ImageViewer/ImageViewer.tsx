import { Box } from '@mui/material';

export function ImageViewer({ src }: { src: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <img src={src} />
    </Box>
  );
}
