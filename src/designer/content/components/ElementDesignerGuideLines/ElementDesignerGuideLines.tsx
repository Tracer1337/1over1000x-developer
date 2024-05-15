import { Box } from '@mui/material';
import { purple } from '@mui/material/colors';
import { useContext, useMemo } from 'react';
import { ElementDesignerContext } from '../ElementDesigner/context';

export function ElementDesignerGuideLines() {
  const context = useContext(ElementDesignerContext);

  const rect = useMemo(
    () => context.target?.getBoundingClientRect(),
    [context.target],
  );

  if (!rect) {
    return;
  }

  const { top, left, width, height } = rect;

  const borderStyle = `${context.width}px dashed ${purple[300]}`;

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          borderTop: borderStyle,
          borderBottom: borderStyle,
          left: 0,
          right: 0,
          top,
          height,
        }}
      ></Box>
      <Box
        sx={{
          position: 'absolute',
          borderLeft: borderStyle,
          borderRight: borderStyle,
          top: 0,
          bottom: 0,
          left,
          width,
        }}
      ></Box>
    </>
  );
}
