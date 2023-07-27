import setupGitlabPipelineModule from './gitlab-pipeline';
import setupGitlabConfettiModule from './gitlab-confetti';

export const modules: Array<{
  path: RegExp;
  setup: () => void;
}> = [
  {
    path: new RegExp(
      'https://gitlab.dzh.hamburg/theraos/app/-/merge_requests/[^/]*/pipelines',
    ),
    setup: setupGitlabPipelineModule,
  },
  {
    path: new RegExp(
      'https://gitlab.dzh.hamburg/theraos/app/-/(merge_requests|issues)/\\d+',
    ),
    setup: setupGitlabConfettiModule,
  },
];
