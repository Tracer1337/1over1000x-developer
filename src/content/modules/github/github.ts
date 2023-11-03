import { registerRouteHandler } from 'shared/bridge';
import { setupDrawioViewer } from './drawio';

export function setup() {
  registerRouteHandler({
    path: /https:\/\/github.com\/.*drawio\/?/,
    callback: setupDrawioViewer,
  });
}
