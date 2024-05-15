import { useContext, useId, useMemo } from 'react';
import { ElementDesignerContext } from '../ElementDesigner/context';
import { Box } from '@mui/material';
import { useElementMeasurements } from '../ElementDesigner/hooks/useElementMeasurements';

function OverlayBox({
  color,
  x,
  y,
  width,
  height,
  cutoutX,
  cutoutY,
  cutoutWidth,
  cutoutHeight,
}: {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  cutoutX: number;
  cutoutY: number;
  cutoutWidth: number;
  cutoutHeight: number;
}) {
  const cutoutId = useId();
  const patternId = useId();

  return (
    <Box
      component="svg"
      width={width}
      height={height}
      sx={{
        transform: `translate(${x}px, ${y}px)`,
      }}
    >
      <defs>
        <mask id={cutoutId}>
          <rect width="100%" height="100%" fill="white" />
          <rect
            x={cutoutX}
            y={cutoutY}
            width={cutoutWidth}
            height={cutoutHeight}
            fill="black"
          />
        </mask>
        <pattern
          id={patternId}
          patternUnits="userSpaceOnUse"
          width="5"
          height="5"
          patternTransform="rotate(45)"
        >
          <line x1="0" y="0" x2="0" y2="5" stroke={color} strokeWidth="6" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        mask={`url(#${cutoutId})`}
        fill={`url(#${patternId})`}
      />
    </Box>
  );
}

export function ElementDesignerMeasurementsOverlay() {
  const context = useContext(ElementDesignerContext);

  const measurements = useElementMeasurements();

  const rect = useMemo(
    () => context.target?.getBoundingClientRect(),
    [context.target],
  );

  if (!measurements || !rect) {
    return;
  }

  const { top, left, width, height } = rect;

  return (
    <Box
      sx={{
        'position': 'absolute',
        top,
        left,
        width,
        height,
        'display': 'grid',
        '& > *': {
          gridArea: '1/1',
        },
      }}
    >
      <OverlayBox
        color="#c7dab8"
        x={0}
        y={0}
        width={width}
        height={height}
        cutoutX={measurements.paddingLeft}
        cutoutY={measurements.paddingTop}
        cutoutWidth={
          width - measurements.paddingLeft - measurements.paddingRight
        }
        cutoutHeight={
          height - measurements.paddingTop - measurements.paddingBottom
        }
      />
      <OverlayBox
        color="#f3cca2"
        x={measurements.marginLeft * -1}
        y={measurements.marginTop * -1}
        width={width + measurements.marginLeft + measurements.marginRight}
        height={height + measurements.marginTop + measurements.marginBottom}
        cutoutX={measurements.marginLeft}
        cutoutY={measurements.marginTop}
        cutoutWidth={width}
        cutoutHeight={height}
      />
    </Box>
  );
}
