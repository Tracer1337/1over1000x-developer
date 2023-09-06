import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import TabIcon from '@mui/icons-material/Tab';
import TerminalIcon from '@mui/icons-material/Terminal';
import TuneIcon from '@mui/icons-material/Tune';

const tabIcons = [CenterFocusWeakIcon, TabIcon, TerminalIcon, TuneIcon];

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
        {tabIcons.map((Icon, index) => (
          <ToggleButton key={index} value={index}>
            <Icon />
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
