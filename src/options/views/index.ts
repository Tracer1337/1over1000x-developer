import SettingsIcon from '@mui/icons-material/Settings';
import { moduleDefs } from 'shared/types';
import GeneralView from './GeneralView';
import React from 'react';
import ModuleView from './ModuleView';

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
  ...moduleDefs.map((module) => ({
    title: module.label,
    icon: module.icon,
    component: () => React.createElement(ModuleView, { module }),
  })),
];

export default views;
