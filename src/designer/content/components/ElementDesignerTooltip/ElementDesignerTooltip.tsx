import { Box } from '@mui/material';
import React from 'react';
import { useTooltipPosition } from './hooks/useTooltipPosition';
import { useTooltipTransform } from './hooks/useTooltipTransform';

export function ElementDesignerTooltip({
  children,
}: React.PropsWithChildren<{}>) {
  const position = useTooltipPosition();

  const transform = useTooltipTransform(position);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        transform,
      }}
    >
      {children}
    </Box>
  );
}
