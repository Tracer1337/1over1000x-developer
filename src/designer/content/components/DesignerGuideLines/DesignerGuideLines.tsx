import { Box } from '@mui/material';
import { purple } from '@mui/material/colors';

export function DesignerGuideLines({
  rect: { left, top, width, height },
  width: lineWidth,
}: {
  rect: DOMRect;
  width: number;
}) {
  const borderStyle = `${lineWidth}px dashed ${purple[300]}`;

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
