import { useRef, useState } from 'react';
import {
  Stack,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import LaunchIcon from '@mui/icons-material/Launch';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import { SavedForm, StorageKeys, useStorageValue } from 'shared/storage';
import { usePageInfo } from 'shared/bridge';
import { useLoadForm } from './hooks/useLoadForm';
import { useConfirm } from 'material-ui-confirm';
import { removeForm } from 'shared/form';

export function FormsList() {
  const labelField = useRef<HTMLInputElement>(null);
  const [forms, setForms] = useStorageValue(StorageKeys.FORMS);
  const pageInfo = usePageInfo();
  const confirm = useConfirm();
  const loadForm = useLoadForm();
  const [edit, setEdit] = useState<SavedForm | null>(null);

  const handleRemove = (form: SavedForm) => {
    if (!forms) {
      return;
    }
    confirm({
      description: form.label
        ? `The form "${form.label}" will be removed`
        : 'This form will be removed',
    }).then(() => removeForm(forms.indexOf(form)));
  };

  const handleLabelSave = () => {
    if (!forms || !edit) {
      return;
    }
    setForms(
      forms.map((form) =>
        form !== edit
          ? form
          : {
              ...form,
              label: labelField.current?.value ?? '',
            },
      ),
    );
    setEdit(null);
  };

  const getFormLabel = (form: SavedForm) =>
    form.label || form.values.filter((value) => value.length > 0).join(', ');

  if (!forms || !pageInfo) {
    return;
  }

  return (
    <List>
      {forms
        .filter((form) => form.host === pageInfo.host)
        .map((form, index) => (
          <ListItem sx={{ pl: 3 }} key={index}>
            {edit !== form ? (
              <ListItemText
                primary={getFormLabel(form)}
                primaryTypographyProps={{
                  sx: {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                }}
              />
            ) : (
              <TextField
                inputRef={labelField}
                defaultValue={form.label}
                size="small"
              />
            )}
            <Stack direction="row" gap={0.5} sx={{ ml: 0.5 }}>
              <IconButton onClick={() => handleRemove(form)}>
                <RemoveIcon />
              </IconButton>
              {edit ? (
                <IconButton onClick={handleLabelSave}>
                  <DoneIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => setEdit(edit === form ? null : form)}
                >
                  <EditIcon />
                </IconButton>
              )}
              <IconButton
                onClick={() => {
                  loadForm(form);
                  window.close();
                }}
              >
                <LaunchIcon />
              </IconButton>
            </Stack>
          </ListItem>
        ))}
    </List>
  );
}
