import React from 'react';
import { createRoot } from 'react-dom/client';
import PipelineEnhancements from './components/PipelineEnhancements';
import { waitForSelector } from 'lib/dom';

export function setupPipelineEnhancements() {
  getPipelineEnhancementsContainer().then((container) =>
    createRoot(container).render(React.createElement(PipelineEnhancements)),
  );
}

async function getPipelineEnhancementsContainer() {
  const parent = await waitForSelector('.content-list.pipelines');
  const element = document.createElement('div');
  parent.prepend(element);
  return element;
}
