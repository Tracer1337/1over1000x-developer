import { DESIGNER_STORAGE_KEY, DesignerStorage } from 'designer';
import { addStorageValueListener, loadStorageValue } from 'shared/storage';
import { setupDesignerGuides } from './guides';

export type DesignerFeatureSetupFunction = () => () => void;

const setupHandlers: Record<
  keyof DesignerStorage['features'],
  DesignerFeatureSetupFunction
> = {
  guides: setupDesignerGuides,
};

const destroyHandlers: Partial<
  Record<
    keyof DesignerStorage['features'],
    ReturnType<DesignerFeatureSetupFunction>
  >
> = {};

export default function setup() {
  loadStorageValue(DESIGNER_STORAGE_KEY).then(handleStorageValue);
  addStorageValueListener(DESIGNER_STORAGE_KEY, handleStorageValue);
}

const handleStorageValue = (value: DesignerStorage | null) => {
  if (!value) {
    return;
  }

  const entries = Object.entries(setupHandlers) as [
    keyof DesignerStorage['features'],
    DesignerFeatureSetupFunction,
  ][];

  entries.forEach(([key, setup]) => {
    if (value.features[key]) {
      destroyHandlers[key] = setup();
    } else {
      destroyHandlers[key]?.();
      delete destroyHandlers[key];
    }
  });
};
