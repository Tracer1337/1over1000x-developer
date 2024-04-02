import { Box } from '@mui/material';
import { PropsWithChildren } from 'react';

export function TheveaButton({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        color: '#fff',
        backgroundColor: '#2f6e80',
        p: '0.5rem 1.3rem',
        border: '1px solid transparent',
        borderRadius: '0.125rem',
        lineHeight: '17.5px',
        width: '100%',
      }}
    >
      {children}
    </Box>
  );
}
