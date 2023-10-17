import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import views from 'popup/views';

export function Navigation({
  tab,
  onChange,
}: {
  tab: number;
  onChange: (tab: number) => void;
}) {
  const handleTabChange = (_event: React.MouseEvent, newTab: number | null) => {
    if (newTab !== null) {
      onChange(newTab);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 'auto',
        bottom: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        background: 'white',
      }}
    >
      <ToggleButtonGroup
        value={tab}
        onChange={handleTabChange}
        exclusive
        color="primary"
        fullWidth
        sx={(theme) => ({
          '& .MuiToggleButton-root': {
            'borderRadius': 0,
            '&..Mui-selected': {
              borderColor: theme.palette.primary.main,
            },
          },
        })}
      >
        {views.map((view, index) => (
          <ToggleButton key={index} value={index}>
            {React.createElement(view.icon)}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
