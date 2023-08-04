import { registerRouteHandler } from 'lib/bridge';
import { setupPipelineEnhancements } from './pipeline';
import { destroyConfetti, setupConfetti } from './confetti';
import { destroySuggestionHelper, setupSuggestionHelper } from './suggestion';

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
    cleanup: destroyConfetti,
  });
  registerRouteHandler({
    path: RegExp(
      'https://gitlab.dzh.hamburg/theraos/app/-/merge_requests/[^/]*/diffs',
    ),
    callback: setupSuggestionHelper,
    cleanup: destroySuggestionHelper,
  });
}
