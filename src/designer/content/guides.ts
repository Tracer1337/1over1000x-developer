import { createRoot } from 'react-dom/client';
import type { DesignerFeatureSetupFunction } from '.';
import DesignerGuides from './components/DesignerGuides';
import { createElement } from 'react';
import { getOrCreateContainer } from 'shared/dom';

export const setupDesignerGuides: DesignerFeatureSetupFunction = () => {
  let currentTarget: HTMLElement | null = null;
  let lockedTarget: HTMLElement | null = null;

  const root = createRoot(getOrCreateContainer('designer-guides'));

  const updateComponent = () => {
    root.render(
      createElement(DesignerGuides, { target: lockedTarget ?? currentTarget }),
    );
  };

  const updateTarget = () => {
    const newTarget = findHoverElement();
    if (newTarget === currentTarget) {
      return;
    }
    currentTarget = newTarget;
    updateComponent();
  };

  const toggleTargetLock = (event: MouseEvent) => {
    if (!event.ctrlKey) {
      return;
    }
    lockedTarget = lockedTarget ? null : currentTarget;
  };

  document.addEventListener('mousemove', updateTarget);
  document.addEventListener('mouseleave', updateTarget);
  document.addEventListener('click', toggleTargetLock);

  return () => {
    document.removeEventListener('mousemove', updateTarget);
    document.removeEventListener('mouseleave', updateTarget);
    document.removeEventListener('click', toggleTargetLock);

    root.unmount();
  };
};

function findHoverElement(): HTMLElement | null {
  const targets = Array.from(document.querySelectorAll<HTMLElement>(':hover'));
  return targets[targets.length - 1] ?? null;
}
