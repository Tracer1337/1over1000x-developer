import { z } from 'zod';
import { DesignerIcon } from './icon';
import DesignerPopup from './popup';

export type DesignerStorage = {
  features: {
    guides: boolean;
  };
};

export const designerStorageDefaultValue: DesignerStorage = {
  features: {
    guides: false,
  },
};

export const DESIGNER_STORAGE_KEY = 'designer_storage_key';

declare module 'shared/storage' {
  interface Storage {
    [DESIGNER_STORAGE_KEY]: DesignerStorage;
  }
}

const designer = {
  key: 'designer',
  label: 'Designer',
  icon: DesignerIcon,
  popup: DesignerPopup,
  config: z.void(),
} as const;

export default designer;
