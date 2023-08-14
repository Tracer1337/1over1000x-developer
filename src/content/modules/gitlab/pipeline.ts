import React from 'react';
import { createRoot } from 'react-dom/client';
import PipelineEnhancements from './components/PipelineEnhancements';
import { shouldHandleElement, waitForSelector } from 'shared/dom';

export function setupPipelineEnhancements() {
  getPipelineEnhancementsContainer().then(
    (container) =>
      container &&
      createRoot(container).render(React.createElement(PipelineEnhancements)),
  );
}

async function getPipelineEnhancementsContainer() {
  const parent = await waitForSelector('.content-list.pipelines');
  if (!shouldHandleElement(parent)) {
    return null;
  }
  const element = document.createElement('div');
  parent.prepend(element);
  return element;
}