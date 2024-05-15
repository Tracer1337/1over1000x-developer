import { TooltipPosition } from './useTooltipPosition';

export function useTooltipTransform(position: TooltipPosition): string {
  switch (position.dir) {
    case 'top left':
      return 'translate(-100%, -100%)';
    case 'top right':
      return 'translate(0, -100%)';
    case 'bottom left':
      return 'translate(-100%, 15px)';
    default:
      return 'translate(0, 15px)';
  }
}
