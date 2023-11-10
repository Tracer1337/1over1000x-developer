import { Collapse } from '@mui/material';
import { ReactNode } from 'react';

export type SpotlightResult = {
  id: string;
  node: ReactNode;
  action: () => void;
  wrapperProps?: React.ComponentProps<typeof Collapse>;
};
