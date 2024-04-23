import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import TabIcon from '@mui/icons-material/Tab';
import TerminalIcon from '@mui/icons-material/Terminal';
import TuneIcon from '@mui/icons-material/Tune';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import designer from 'designer';
import CaptureView from '../CaptureView';
import TabView from '../TabView';
import FormsView from '../FormsView';
import CommandsView from '../CommandsView';
import ModulesView from '../ModulesView';
import { useSettings } from 'shared/settings';
import { useMemo } from 'react';

export type PopupView = {
  path: string;
  title: string;
  icon: React.FC;
  component: React.FC;
};

const staticPopupViews: PopupView[] = [
  {
    path: '/capture',
    title: 'Tab Capture',
    icon: CenterFocusWeakIcon,
    component: CaptureView,
  },
  {
    path: '/tabs',
    title: 'Saved Tabs',
    icon: TabIcon,
    component: TabView,
  },
  {
    path: '/forms',
    title: 'Saved Forms',
    icon: DriveFileRenameOutlineIcon,
    component: FormsView,
  },
  {
    path: '/commands',
    title: 'Commands',
    icon: TerminalIcon,
    component: CommandsView,
  },
  {
    path: '/modules',
    title: 'Modules',
    icon: TuneIcon,
    component: ModulesView,
  },
];

export function usePopupViews() {
  const [settings] = useSettings();

  const modulePopupViews = useMemo((): PopupView[] => {
    const modules = [designer];

    return modules
      .filter((module) => settings.modules[module.key].enabled)
      .map((module) => ({
        path: `/${module.key}`,
        title: module.label,
        icon: module.icon,
        component: module.popup,
      }));
  }, [settings]);

  return [...staticPopupViews, ...modulePopupViews];
}
