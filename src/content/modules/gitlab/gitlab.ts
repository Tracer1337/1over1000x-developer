import { registerRouteHandler } from 'shared/bridge';
import { setupPipelineEnhancements } from './pipeline';
import { setupConfetti } from './confetti';
import { setupSuggestionHelper } from './suggestion';
import { setupTabHelper } from './tab';
import { setupClipboardHelper } from './clipboard';

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
  registerRouteHandler({
    path: RegExp(
      'https://gitlab.dzh.hamburg/theraos/app/-/merge_requests/[^/]*/diffs',
    ),
    callback: setupSuggestionHelper,
  });
  registerRouteHandler({
    path: RegExp('https://gitlab.dzh.hamburg/theraos/app/-/issues/\\d+'),
    callback: setupTabHelper,
  });
  registerRouteHandler({
    path: RegExp('https://gitlab.dzh.hamburg/theraos/app/-/issues/\\d+'),
    callback: setupClipboardHelper,
  });
}
