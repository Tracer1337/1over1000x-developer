import React from 'react';
import { createRoot } from 'react-dom/client';
import PipelineEnhancements from '../components/PipelineEnhancements';
import {
  getOrCreateContainer,
  shouldHandleElement,
  waitForSelector,
} from 'shared/dom';

const containerSelector = '.content-list.pipelines';

export function setupPipelineEnhancements() {
  waitForSelector(containerSelector).then(() => {
    const container = getOrCreateContainer(
      'pipeline-helper',
      containerSelector,
      'prepend',
    );
    if (shouldHandleElement(container)) {
      createRoot(container).render(React.createElement(PipelineEnhancements));
    }
  });
}
