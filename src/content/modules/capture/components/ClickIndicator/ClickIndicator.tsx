import { useEffect, useState } from 'react';
import { Box, Grow, alpha } from '@mui/material';

const size = 32;
const timeout = 300;

export function ClickIndicator({
  event,
  onDestroy,
}: {
  event: MouseEvent;
  onDestroy: () => void;
}) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!show) {
      setTimeout(onDestroy, timeout);
    }
  }, [show]);

  return (
    <Grow
      in={show}
      timeout={timeout}
      easing="linear"
      addEndListener={(node) =>
        node.addEventListener('transitionend', () => setShow(false))
      }
    >
      <Box
        sx={(theme) => ({
          position: 'absolute',
          top: event.pageY - size / 2,
          left: event.pageX - size / 2,
          width: size,
          height: size,
          bgcolor: alpha(theme.palette.primary.main, 0.5),
          borderRadius: '50%',
          opacity: 0.67,
          zIndex: 99999,
          pointerEvents: 'none',
        })}
      />
    </Grow>
  );
}
