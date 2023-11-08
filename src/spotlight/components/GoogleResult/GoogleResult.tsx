import { Box, Paper, Typography } from '@mui/material';
import { useSpotlight } from '../Spotlight/context';

export function GoogleResult() {
  const { input, onClose } = useSpotlight();

  const href = `https://www.google.com/search?q=${input}`;

  const onClick = () => {
    window.open(href, '_blank');
    onClose();
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        height: 56,
        p: 2,
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
      component="a"
      href="#"
      onClick={onClick}
    >
      <Box
        component="img"
        src={chrome.runtime.getURL('/assets/google-logo.svg')}
        sx={{ width: 24, ml: 0.5, mr: 2.5 }}
      />
      <Typography>Google</Typography>
    </Paper>
  );
}
