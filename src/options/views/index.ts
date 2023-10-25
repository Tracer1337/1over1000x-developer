import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import { moduleDefs } from 'shared/types';
import { isZodObject } from 'shared/schema';
import GeneralView from './GeneralView';
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
  ...moduleDefs
    .filter((module) => isZodObject(module.config))
    .map((module) => ({
      title: module.label,
      icon: module.icon,
      component: () => React.createElement(ModuleView, { module }),
    })),
];

export default views;
