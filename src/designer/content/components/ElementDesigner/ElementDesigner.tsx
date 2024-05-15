import { Box } from '@mui/material';
import { DESIGNER_STORAGE_KEY } from 'designer';
import { useStorageValue } from 'shared/storage';
import ElementDesignerHighlight from '../ElementDesignerHighlight';
import ElementDesignerGuideLines from '../ElementDesignerGuideLines';
import ElementDesignerMeasurementsTooltip from '../ElementDesignerMeasurementsTooltip';
import ElementDesignerMeasurementsOverlay from '../ElementDesignerMeasurementsOverlay';

export function ElementDesigner() {
  const [designerStorage] = useStorageValue(DESIGNER_STORAGE_KEY);

  if (!designerStorage) {
    return;
  }

  return (
    <Box
      sx={{
        pointerEvents: 'none',
        zIndex: '999999',
        position: 'fixed',
        inset: 0,
      }}
    >
      <ElementDesignerHighlight />
      {designerStorage.features.guides && <ElementDesignerGuideLines />}
      {designerStorage.features.measure && (
        <>
          <ElementDesignerMeasurementsOverlay />
          <ElementDesignerMeasurementsTooltip />
        </>
      )}
    </Box>
  );
}
