import { z } from 'zod';
import { GitLabIcon } from 'shared/icons';
import { PasswordSchema } from 'shared/schema';
import { createIssue } from './lib/issue';
import { setupPipelineEnhancements } from './lib/pipeline';
import { setupConfetti } from './lib/confetti';
import { setupSuggestionHelper } from './lib/suggestion';
import { setupIssueActions } from './lib/issue';
import { setupFileHelper } from './lib/file';
import { ExtensionModule } from 'shared/types';

const projectPath = `https://${window.location.host}/.*/-`;

export const gitlabModule: ExtensionModule = {
  key: 'gitlab',
  label: 'GitLab',
  icon: GitLabIcon,
  toggle: true,
  config: z.object({
    host: z
      .string()
      .nullable()
      .default(null)
      .describe('Host // Your GitLab Host (gitlab.my-company.com)'),
    project: z
      .string()
      .nullable()
      .default(null)
      .describe(
        'Main Project // Your Main Project in GitLab (/my-company/my-project)',
      ),
    token: PasswordSchema.nullable()
      .default(null)
      .describe(
        'Personal Access Token // Your Token for interacting with the GitLab API (permission: api)',
      ),
  }),
  content: [
    {
      path: RegExp(`${projectPath}/merge_requests/[^/]*/pipelines`),
      callback: setupPipelineEnhancements,
    },
    {
      path: RegExp(`${projectPath}/(merge_requests|issues)/\\d+`),
      callback: setupConfetti,
    },
    {
      path: RegExp(`${projectPath}/merge_requests/[^/]*/diffs`),
      callback: setupSuggestionHelper,
    },
    {
      path: RegExp(`${projectPath}/merge_requests/[^/]*(/diffs)?$`),
      callback: setupFileHelper,
    },
    {
      path: RegExp(`${projectPath}/issues/(\\d+|new)`),
      callback: setupIssueActions,
    },
  ],
  menu: [
    {
      key: 'user-story',
      action: createIssue,
    },
  ],
};
