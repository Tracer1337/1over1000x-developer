import { registerRouteHandler } from 'shared/bridge';
import { setupPipelineEnhancements } from './pipeline';
import { setupConfetti } from './confetti';
import { setupIssueActions } from './issue';
import { setupFileHelper } from './file';

export function setup() {
  const projectPath = `https://${window.location.host}/.*/-`;
  registerRouteHandler({
    path: RegExp(`${projectPath}/merge_requests/[^/]*/pipelines`),
    callback: setupPipelineEnhancements,
  });
  registerRouteHandler({
    path: RegExp(`${projectPath}/(merge_requests|issues)/\\d+`),
    callback: setupConfetti,
  });
  registerRouteHandler({
    path: RegExp(`${projectPath}/merge_requests/[^/]*(/diffs)?$`),
    callback: setupFileHelper,
  });
  registerRouteHandler({
    path: RegExp(`${projectPath}/issues/(\\d+|new)`),
    callback: setupIssueActions,
  });
}
