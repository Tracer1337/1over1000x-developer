import { DESIGNER_STORAGE_KEY, designerStorageDefaultValue } from 'designer';
import { produce } from 'immer';
import { useStorageValue } from 'shared/storage';

export function useToggleFeature() {
  const [designerStorage, setDesignerStorage] =
    useStorageValue(DESIGNER_STORAGE_KEY);

  const toggleFeature = (
    feature: keyof NonNullable<typeof designerStorage>['features'],
  ) => {
    setDesignerStorage(
      produce(designerStorage ?? designerStorageDefaultValue, (draft) => {
        draft.features[feature] = !draft.features[feature];
      }),
    );
  };

  return toggleFeature;
}
