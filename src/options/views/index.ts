import SettingsIcon from '@mui/icons-material/Settings';
import { moduleDefs } from 'shared/types';
import GeneralView from './GeneralView';
import SpotlightView from './SpotlightView';

const spotlightModule = moduleDefs.find(({ key }) => key === 'spotlight')!;

export type View = {
  title: string;
  icon: React.FC;
  component: React.FC;
};

const views: View[] = [
  {
    title: 'General',
    icon: SettingsIcon,
    component: GeneralView,
  },
  {
    title: spotlightModule.label,
    icon: spotlightModule.icon,
    component: SpotlightView,
  },
];

export default views;
