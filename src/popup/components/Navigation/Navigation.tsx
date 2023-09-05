import { AppBar, Tabs, Tab } from '@mui/material';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import TabIcon from '@mui/icons-material/Tab';
import TerminalIcon from '@mui/icons-material/Terminal';
import TuneIcon from '@mui/icons-material/Tune';

export function Navigation({
  tab,
  onChange,
}: {
  tab: number;
  onChange: (tab: number) => void;
}) {
  return (
    <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
      <Tabs
        value={tab}
        onChange={(_event, newTab) => onChange(newTab)}
        textColor="inherit"
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        <Tab icon={<CenterFocusWeakIcon />} />
        <Tab icon={<TabIcon />} />
        <Tab icon={<TerminalIcon />} />
        <Tab icon={<TuneIcon />} />
      </Tabs>
    </AppBar>
  );
}
