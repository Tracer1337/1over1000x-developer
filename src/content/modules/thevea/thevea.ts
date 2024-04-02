import { registerRouteHandler } from 'shared/bridge';
import { setupAccountSelect } from './account';

export function setup() {
  registerRouteHandler({
    path: /https:\/\/[^/]+\.thevea\.[^/]+.*\/auth\/login.*/,
    callback: setupAccountSelect,
  });
}
