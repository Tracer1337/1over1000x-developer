import { Box } from '@mui/material';
import { DesignerFeatureList } from './components/DesignerFeatureList/DesignerFeatureList';

export function DesignerPopup() {
  return (
    <Box sx={{ mt: -2 }}>
      <DesignerFeatureList />
    </Box>
  );
}
