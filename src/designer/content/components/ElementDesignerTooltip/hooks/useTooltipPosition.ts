import { useContext, useEffect, useState } from 'react';
import { ElementDesignerContext } from '../../ElementDesigner/context';

export type TooltipPosition = {
  x: number;
  y: number;
  dir: 'top left' | 'top right' | 'bottom left' | 'bottom right';
};

export function useTooltipPosition() {
  const [position, setPosition] = useState<TooltipPosition>({
    x: 0,
    y: 0,
    dir: 'top left',
  });

  const { locked } = useContext(ElementDesignerContext);

  useEffect(() => {
    const getDirection = (x: number, y: number): TooltipPosition['dir'] => {
      const mx = window.innerWidth / 2;
      const my = window.innerHeight / 2;

      if (x <= mx && y <= my) {
        return 'bottom right';
      }

      if (x > mx && y <= my) {
        return 'bottom left';
      }

      if (x <= mx && y > my) {
        return 'top right';
      }

      return 'top left';
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (locked) {
        return;
      }

      setPosition({
        x: event.clientX,
        y: event.clientY,
        dir: getDirection(event.clientX, event.clientY),
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [setPosition, locked]);

  return position;
}
