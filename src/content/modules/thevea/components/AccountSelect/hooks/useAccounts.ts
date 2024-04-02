import { useSettings } from 'shared/settings';

export type Account = {
  name: string;
  email: string;
  password: string;
};

export function useAccounts() {
  const [settings] = useSettings();

  const {
    modules: { thevea },
  } = settings;

  if (!thevea.config.accounts) {
    return [];
  }

  const lines = thevea.config.accounts.split(/\r?\n/);

  const accountFromLine = (line: string): Account => {
    const parts = line.split(';');

    return {
      name: parts[0],
      email: parts[1],
      password: parts[2],
    };
  };

  return lines.map((line) => accountFromLine(line));
}
