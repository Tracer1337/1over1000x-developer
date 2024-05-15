import { DESIGNER_STORAGE_KEY, DesignerStorage } from 'designer';
import { addStorageValueListener, loadStorageValue } from 'shared/storage';
import { setupElementDesigner } from './element';

let destroyElementDesigner: (() => void) | null = null;

const elementDesignerFeatuers: (keyof DesignerStorage['features'])[] = [
  'guides',
  'measure',
];

export type DesignerFeatureSetupFunction = () => () => void;

export default function setup() {
  loadStorageValue(DESIGNER_STORAGE_KEY).then(handleStorageValue);

  const removeStorageValueListener = addStorageValueListener(
    DESIGNER_STORAGE_KEY,
    handleStorageValue,
  );

  return () => {
    removeStorageValueListener();
    destroyAllFeatures();
  };
}

function handleStorageValue(value: DesignerStorage | null) {
  if (!value) {
    return;
  }

  if (elementDesignerFeatuers.some((feature) => value.features[feature])) {
    destroyElementDesigner = setupElementDesigner();
  } else {
    destroyElementDesigner?.();
  }
}

function destroyAllFeatures() {
  destroyElementDesigner?.();
}
