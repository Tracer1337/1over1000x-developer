import setupGitlabPipelineModule from './gitlab-pipeline';

export const modules: [
  {
    path: RegExp;
    setup: () => void;
  },
] = [
  {
    path: new RegExp(
      'https://gitlab.dzh.hamburg/theraos/app/-/merge_requests/[^/]*/pipelines',
    ),
    setup: setupGitlabPipelineModule,
  },
];
