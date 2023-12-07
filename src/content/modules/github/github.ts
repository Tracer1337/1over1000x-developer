import { registerRouteHandler } from 'shared/bridge';
import { setupFileViewer } from './file';
import { setupDashboard } from './dashboard';

export function setup() {
  registerRouteHandler({
    path: /https:\/\/github.com\/.*drawio\/?/,
    callback: setupFileViewer,
  });
  registerRouteHandler({
    path: /https:\/\/github\.com\/(dashboard)?$/,
    callback: setupDashboard,
  });
}
