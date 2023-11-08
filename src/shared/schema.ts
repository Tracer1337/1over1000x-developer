import { ReactNode, createElement } from 'react';
import { z } from 'zod';
import {
  createTsForm,
  useTsController,
  useDescription,
  createUniqueFieldSchema,
} from '@ts-react/form';
import { TextField as MuiTextField, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export function getDefaultValues<Schema extends z.AnyZodObject>(
  schema: Schema,
) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => [
      key,
      value instanceof z.ZodDefault ? value._def.defaultValue() : undefined,
    ]),
  );
}

export function isZodObject(schema: {
  _def: { typeName: string };
}): schema is z.ZodObject<any> {
  return schema._def.typeName === z.ZodFirstPartyTypeKind.ZodObject;
}

export const PasswordSchema = createUniqueFieldSchema(z.string(), 'password');

export const SchemaForm = createTsForm(
  [
    [z.string(), TextField],
    [PasswordSchema, () => createElement(TextField, { isPasswordField: true })],
  ] as const,
  {
    FormComponent: SchemaFormContainer,
  },
);

function SchemaFormContainer({
  children,
  onSubmit,
  loading,
}: {
  children: ReactNode;
  onSubmit: () => void;
  loading: boolean;
}) {
  return createElement(
    'form',
    { onSubmit },
    createElement(
      Stack,
      { gap: 2 },
      children,
      createElement(
        LoadingButton,
        {
          type: 'submit',
          variant: 'outlined',
          loading,
        },
        'Save',
      ),
    ),
  );
}

function TextField({ isPasswordField = false }) {
  const { field, error } = useTsController<string>();
  const description = useDescription();

  return createElement(MuiTextField, {
    ...description,
    value: field.value ?? '',
    onChange: (e) => field.onChange(e.currentTarget.value),
    error: !!error?.errorMessage,
    helperText: error?.errorMessage,
    type: isPasswordField ? 'password' : 'text',
  });
}
