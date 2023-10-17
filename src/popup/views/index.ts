import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import TabIcon from '@mui/icons-material/Tab';
import TerminalIcon from '@mui/icons-material/Terminal';
import TuneIcon from '@mui/icons-material/Tune';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CaptureView from './CaptureView';
import TabView from './TabView';
import CommandsView from './CommandsView';
import ModulesView from './ModulesView';
import FormsView from './FormsView';

export type View = {
  title: string;
  icon: React.FC;
  component: React.FC;
};

const views: View[] = [
  {
    title: 'Tab Capture',
    icon: CenterFocusWeakIcon,
    component: CaptureView,
  },
  {
    title: 'Saved Tabs',
    icon: TabIcon,
    component: TabView,
  },
  {
    title: 'Saved Forms',
    icon: DriveFileRenameOutlineIcon,
    component: FormsView,
  },
  {
    title: 'Commands',
    icon: TerminalIcon,
    component: CommandsView,
  },
  {
    title: 'Modules',
    icon: TuneIcon,
    component: ModulesView,
  },
];

export default views;
