import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  getOrCreateContainer,
  shouldHandleElement,
  withShadowRoot,
} from 'shared/dom';
import { createRenderLoop } from 'shared/bridge';
import Spotlight from './components/Spotlight';

export function setup() {
  createRenderLoop(renderSpotlight);
}

function renderSpotlight() {
  const container = getOrCreateContainer('1/1000x-developer-spotlight');
  if (shouldHandleElement(container)) {
    createRoot(container).render(
      withShadowRoot(container, React.createElement(Spotlight)),
    );
  }
}
