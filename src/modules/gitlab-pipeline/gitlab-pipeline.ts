import React from 'react';
import { createRoot } from 'react-dom/client';
import PipelineEnhancements from './components/PipelineEnhancements';

export function setup() {
  createRoot(getPipelineEnhancementsContainer()).render(
    React.createElement(PipelineEnhancements),
  );
}

function getPipelineEnhancementsContainer() {
  const parent = document.querySelector('.content-list.pipelines');
  if (!parent) {
    throw new Error(
      "Element with selector '.content-list.pipelines' could not be found",
    );
  }
  const element = document.createElement('div');
  parent.prepend(element);
  return element;
}
