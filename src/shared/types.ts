import SearchIcon from '@mui/icons-material/Search';
import { z } from 'zod';
import { GitLabIcon } from './icons';

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
      host: z.string().nullable().default(null).describe('Host'),
    }),
  },
  {
    key: 'spotlight',
    label: 'Spotlight',
    icon: SearchIcon,
    config: z.void(),
  },
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
