import { getHost } from './dom';
import {
  SavedForm,
  StorageKeys,
  loadStorageValue,
  saveStorageValue,
} from './storage';

export async function saveForm() {
  const currentForms = (await loadStorageValue(StorageKeys.FORMS)) || [];

  const values = queryInputValues();

  await saveStorageValue(StorageKeys.FORMS, [
    ...currentForms,
    {
      label: '',
      host: getHost(),
      values,
    },
  ]);
}

function queryInputValues() {
  return queryInputFields().map((input) => {
    switch (input.type) {
      case 'checkbox':
      case 'radio':
        return input.checked ? 'checked' : '';
      default:
        return input.value;
    }
  });
}

export function loadForm(form: SavedForm) {
  queryInputFields().forEach((input, index) => {
    const savedValue = form.values[index];

    switch (input.type) {
      case 'checkbox':
      case 'radio':
        const checked = savedValue === 'checked';
        if (!checked) {
          return;
        }
        input.checked = checked;
        break;
      default:
        input.value = savedValue;
    }

    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('input'));
  });
}

export async function removeForm(index: number) {
  const forms = (await loadStorageValue(StorageKeys.FORMS)) || [];
  forms.splice(index, 1);
  await saveStorageValue(StorageKeys.FORMS, forms);
}

function queryInputFields() {
  return Array.from(
    document.querySelectorAll('form input, form select'),
  ).filter(
    (input): input is HTMLInputElement & HTMLSelectElement =>
      input instanceof HTMLInputElement || input instanceof HTMLSelectElement,
  );
}
