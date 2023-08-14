import { Box, Typography } from '@mui/material';

export function Header() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" textAlign="center" sx={{ mb: 2 }}>
        1/1000x Developer
      </Typography>
      <Box component="img" src="/icons/icon_48.png" />
    </Box>
  );
}
