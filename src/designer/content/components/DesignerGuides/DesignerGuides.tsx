import { Box } from '@mui/material';
import { useMemo } from 'react';
import DesignerGuideHighlight from '../DesignerGuideHighlight';
import DesignerGuideLines from '../DesignerGuideLines';

export function DesignerGuides({ target }: { target: HTMLElement | null }) {
  const rect = useMemo(() => target?.getBoundingClientRect(), [target]);

  if (!rect) {
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
      <DesignerGuideHighlight rect={rect} width={1.5} />
      <DesignerGuideLines rect={rect} width={1.5} />
    </Box>
  );
}
