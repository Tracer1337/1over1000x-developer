import React from 'react';
import { createRoot } from 'react-dom/client';
import { shouldHandleElement } from 'shared/dom';
import { createRenderLoop } from 'shared/bridge';
import Spotlight from './components/Spotlight';

const CONTAINER_ID = '1/1000x-developer-spotlight';

export function setup() {
  createRenderLoop(renderSpotlight);
}

function renderSpotlight() {
  const container = getSpotlightContainer();
  if (shouldHandleElement(container)) {
    createRoot(container).render(React.createElement(Spotlight));
  }
}

function getSpotlightContainer() {
  let element = document.getElementById(CONTAINER_ID);
  if (!element) {
    element = document.createElement('div');
    element.setAttribute('id', CONTAINER_ID);
    document.body.appendChild(element);
  }
  return element;
}
