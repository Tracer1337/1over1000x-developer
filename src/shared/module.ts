export type Module = 'gitlab' | 'spotlight';

export const moduleDefs: { key: Module; label: string }[] = [
  {
    key: 'gitlab',
    label: 'GitLab',
  },
  {
    key: 'spotlight',
    label: 'Spotlight',
  },
];
