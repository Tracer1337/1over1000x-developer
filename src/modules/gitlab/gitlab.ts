import { registerRouteHandler } from 'lib/bridge';
import { setupPipelineEnhancements } from './pipeline';
import { setupConfetti } from './confetti';

export function setup() {
  registerRouteHandler({
    path: RegExp(
      'https://gitlab.dzh.hamburg/theraos/app/-/merge_requests/[^/]*/pipelines',
    ),
    callback: setupPipelineEnhancements,
  });
  registerRouteHandler({
    path: RegExp(
      'https://gitlab.dzh.hamburg/theraos/app/-/(merge_requests|issues)/\\d+',
    ),
    callback: setupConfetti,
  });
}
