import query from 'shared/query';
import { Account } from './useAccounts';

export function useSelectAccount() {
  const setInputValue = (input: HTMLInputElement | null, value: string) => {
    if (!input) {
      return;
    }

    input.value = value;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('input'));
  };

  const selectAccount = (account: Account) => {
    setInputValue(query('thevea.login.email'), account.email);
    setInputValue(query('thevea.login.password'), account.password);

    query('thevea.login.submit')?.click();
  };

  return selectAccount;
}
