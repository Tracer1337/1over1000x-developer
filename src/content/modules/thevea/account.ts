import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import {
  getOrCreateContainer,
  shouldHandleElement,
  waitForSelector,
} from 'shared/dom';
import AccountSelect from './components/AccountSelect';

export function setupAccountSelect() {
  waitForSelector('app-login-form').then(renderAccountSelect);
  waitForSelector('app-login-form').then(patchFormStyling);
}

function renderAccountSelect() {
  const container = getOrCreateContainer(
    'account-select',
    'app-login-form',
    'prepend',
  );
  if (shouldHandleElement(container)) {
    createRoot(container).render(createElement(AccountSelect));
  }
}

function patchFormStyling() {
  const form = document.querySelector('app-login-form form');

  if (!form) {
    return;
  }

  form.setAttribute('style', 'margin-top: 0');
}
