import { Alert, CircularProgress, Snackbar } from '@mui/material';
import { Module, moduleDefs } from 'shared/types';
import { SchemaForm, isZodObject } from 'shared/schema';
import { useSubmit } from './hooks/useSubmit';
import { useDefaultValue } from './hooks/useDefaultValue';

export function ModuleView<K extends Module>({
  module,
}: {
  module: Extract<(typeof moduleDefs)[number], { key: K }>;
}) {
  const defaultValue = useDefaultValue(module);
  const { submit, isLoading, snackbar } = useSubmit(module);

  if (!isZodObject(module.config)) {
    return;
  }

  if (!defaultValue) {
    return <CircularProgress />;
  }

  return (
    <>
      <SchemaForm
        schema={module.config}
        onSubmit={submit}
        defaultValues={defaultValue}
        formProps={{ loading: isLoading }}
      />
      <Snackbar
        {...snackbar}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={snackbar.onClose}
          severity="success"
          sx={{ width: '100%' }}
          variant="filled"
        >
          Settings saved
        </Alert>
      </Snackbar>
    </>
  );
}
