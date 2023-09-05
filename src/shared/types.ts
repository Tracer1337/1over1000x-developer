export type Module = (typeof moduleDefs)[number]['key'];

export const moduleDefs = [
  {
    key: 'gitlab',
    label: 'GitLab',
  },
  {
    key: 'spotlight',
    label: 'Spotlight',
  },
] as const;

export type Command = (typeof commandDefs)[number]['key'];

export const commandDefs = [
  {
    key: 'reload-tabs',
    label: 'Reload all tabs',
  },
  {
    key: 'tab-capture',
    label: 'Record current tab',
  },
] as const;

export type CaptureFormat = (typeof captureFormatDefs)[number]['key'];

export const captureFormatDefs = [
  {
    key: 'webm',
    label: 'WebM',
  },
  {
    key: 'mp4',
    label: 'MP4',
  },
  {
    key: 'gif',
    label: 'GIF',
  },
] as const;
