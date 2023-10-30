import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  getOrCreateContainer,
  shouldHandleElement,
  withShadowRoot,
} from 'shared/dom';
import { addExtensionListener } from 'shared/bridge';
import Spotlight from './components/Spotlight';

export function setup() {
  addExtensionListener('spotlight.launch', renderSpotlight);
}

function renderSpotlight() {
  const container = getOrCreateContainer('1/1000x-developer-spotlight');
  createRoot(container).render(
    withShadowRoot(
      container,
      React.createElement(Spotlight, {
        onClose: () => container.remove(),
      }),
    ),
  );
}
