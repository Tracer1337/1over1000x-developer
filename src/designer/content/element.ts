import { createRoot } from 'react-dom/client';
import type { DesignerFeatureSetupFunction } from '.';
import { createElement } from 'react';
import { getOrCreateContainer } from 'shared/dom';
import ElementDesigner from './components/ElementDesigner';
import { ElementDesignerContext } from './components/ElementDesigner/context';

export const setupElementDesigner: DesignerFeatureSetupFunction = () => {
  let currentTarget: HTMLElement | null = null;
  let locked = false;
  let lockedTarget: HTMLElement | null = null;

  const root = createRoot(getOrCreateContainer('element-designer'));

  const updateComponent = () => {
    root.render(
      createElement(
        ElementDesignerContext.Provider,
        {
          value: {
            target: lockedTarget ?? currentTarget,
            width: 1.5,
            locked,
          },
        },
        createElement(ElementDesigner),
      ),
    );
  };

  const handleMouseMove = () => {
    currentTarget = findHoverElement();
    updateComponent();
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (event.ctrlKey) {
      locked = true;
    }
    updateComponent();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }
    if (event.key === 'Escape') {
      locked = false;
      return;
    }
    if (locked) {
      return;
    }
    if (event.ctrlKey) {
      lockedTarget = currentTarget;
      document.body.style.pointerEvents = 'none';
    }
  };

  const handleKeyUp = () => {
    if (locked) {
      return;
    }
    lockedTarget = null;
    document.body.style.pointerEvents = 'unset';
  };

  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseleave', handleMouseMove);
  document.addEventListener('mousedown', handleMouseDown);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  return () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseleave', handleMouseMove);
    document.removeEventListener('mousedown', handleMouseDown);
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    root.unmount();
  };
};

function findHoverElement(): HTMLElement | null {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(':hover'));
  return targets[targets.length - 1] ?? null;
}
