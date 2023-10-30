import { Collapse } from '@mui/material';
import { Settings } from 'shared/storage';
import { SpotlightResult } from '../Spotlight/results';

export type ResultComponent<K extends SpotlightResult['type']> = React.FC<{
  settings: Settings;
  result: Extract<SpotlightResult, { type: K }>;
  selected: boolean;
  onClose: () => void;
}> & {
  wrapperProps?: React.ComponentProps<typeof Collapse>;
};
