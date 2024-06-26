import { z } from 'zod';
import thevea from 'thevea';
import designer from 'designer';
import { GitLabIcon } from './icons';
import { PasswordSchema } from './schema';

export type Module = (typeof moduleDefs)[number]['key'];

export type ModuleConfig<K extends Module> = {
  enabled: boolean;
  config: z.infer<Extract<(typeof moduleDefs)[number], { key: K }>['config']>;
};

export const moduleDefs = [
  {
    key: 'gitlab',
    label: 'GitLab',
    icon: GitLabIcon,
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
  },
  thevea,
  designer,
] as const;

export type Command = (typeof commandDefs)[number]['key'];

export const commandDefs = [
  {
    key: 'reload-tabs',
    label: 'Reload All Tabs',
  },
] as const;

export type CaptureFormat = (typeof captureFormatDefs)[number]['key'];

export const captureFormatDefs = [
  {
    key: 'webm',
    label: 'WebM',
  },
  {
    key: 'gif',
    label: 'GIF',
  },
] as const;
