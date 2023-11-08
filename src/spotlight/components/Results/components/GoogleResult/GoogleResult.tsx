import { Box, Paper, Typography } from '@mui/material';
import { useAction } from '../../hooks/useAction';
import { ResultComponent } from '../../types';

const GoogleResult: ResultComponent<'google'> = ({
  settings: _settings,
  result,
  selected,
  onClose,
}) => {
  const href = `https://www.google.com/search?q=${result.data.search}`;

  const action = useAction({
    active: selected,
    callback: () => {
      window.open(href, '_blank');
      onClose();
    },
  });

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
      onClick={action}
    >
      <Box
        component="img"
        src={chrome.runtime.getURL('/assets/google-logo.svg')}
        sx={{ width: 24, ml: 0.5, mr: 2.5 }}
      />
      <Typography>Google</Typography>
    </Paper>
  );
};

GoogleResult.wrapperProps = {
  sx: {
    width: 'calc(50% - 4px)',
  },
};

export { GoogleResult };
