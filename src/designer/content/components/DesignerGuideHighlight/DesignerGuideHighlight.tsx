import { Box } from '@mui/material';
import { purple } from '@mui/material/colors';

export function DesignerGuideHighlight({
  rect: { top, left, width, height },
  width: lineWidth,
}: {
  rect: DOMRect;
  width: number;
}) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top,
        left,
        width,
        height,
        outline: `${lineWidth}px solid ${purple[600]}`,
      }}
    ></Box>
  );
}
