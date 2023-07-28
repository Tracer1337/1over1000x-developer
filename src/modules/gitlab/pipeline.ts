import React from 'react';
import { createRoot } from 'react-dom/client';
import PipelineEnhancements from './components/PipelineEnhancements';
import { canMountComponent, waitForSelector } from 'lib/dom';

export function setupPipelineEnhancements() {
  getPipelineEnhancementsContainer().then(
    (container) =>
      container &&
      createRoot(container).render(React.createElement(PipelineEnhancements)),
  );
}

async function getPipelineEnhancementsContainer() {
  const parent = await waitForSelector('.content-list.pipelines');
  if (!canMountComponent(parent)) {
    return null;
  }
  const element = document.createElement('div');
  parent.prepend(element);
  return element;
}
