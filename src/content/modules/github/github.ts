import { registerRouteHandler } from 'shared/bridge';
import { setupFileViewer } from './file';

export function setup() {
  registerRouteHandler({
    path: /https:\/\/github.com\/.*drawio\/?/,
    callback: setupFileViewer,
  });
}
