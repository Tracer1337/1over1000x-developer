import SettingsIcon from '@mui/icons-material/Settings';
import { moduleDefs } from 'shared/types';
import GeneralView from './GeneralView';
import SpotlightView from './SpotlightView';

const spotlightModule = moduleDefs.find(({ key }) => key === 'spotlight')!;

const views: { title: string; icon: React.FC; component: React.FC }[] = [
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
