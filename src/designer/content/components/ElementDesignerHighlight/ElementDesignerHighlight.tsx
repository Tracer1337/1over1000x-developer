import { Box } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useContext, useMemo } from 'react';
import { ElementDesignerContext } from '../ElementDesigner/context';

export function ElementDesignerHighlight() {
  const context = useContext(ElementDesignerContext);

  const rect = useMemo(
    () => context.target?.getBoundingClientRect(),
    [context.target],
  );

  if (!rect) {
    return;
  }

  const { top, left, width, height } = rect;

  return (
    <Box
      sx={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        outline: `${context.width}px solid ${purple[600]}`,
      }}
    ></Box>
  );
}
