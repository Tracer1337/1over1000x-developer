import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Storage,
  StorageKeys,
  addStorageValueListener,
  loadStorageValue,
} from 'shared/storage';
import ClickIndicator from './components/ClickIndicator';

export function setup() {
  loadStorageValue(StorageKeys.CAPTURE).then(handleCaptureValueChange);
  addStorageValueListener(StorageKeys.CAPTURE, handleCaptureValueChange);
}

function handleCaptureValueChange(value: Storage[StorageKeys.CAPTURE] | null) {
  if (!value) {
    return;
  }
  if (value.state === 'running') {
    document.addEventListener('mousedown', handleMouseDown);
  } else {
    document.removeEventListener('mousedown', handleMouseDown);
  }
}

function handleMouseDown(event: MouseEvent) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(
    createElement(ClickIndicator, {
      event,
      onDestroy: () => {
        root.unmount();
        container.remove();
      },
    }),
  );
}
