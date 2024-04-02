import { Grid } from '@mui/material';
import { useSelectAccount } from './hooks/useSelectAccount';
import { useAccounts } from './hooks/useAccounts';
import TheveaButton from '../TheveaButton';

export function AccountSelect() {
  const accounts = useAccounts();
  const selectAccount = useSelectAccount();

  return (
    <Grid container spacing={1} sx={{ mt: 2, mb: 4 }}>
      {accounts.map((account) => (
        <Grid item key={account.email} xs={6}>
          <TheveaButton onClick={() => selectAccount(account)}>
            {account.name}
          </TheveaButton>
        </Grid>
      ))}
    </Grid>
  );
}
