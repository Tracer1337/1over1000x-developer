import { getHost } from 'shared/dom';
import {
  SavedForm,
  Settings,
  StorageKeys,
  loadStorageValue,
} from 'shared/storage';
import { commandDefs } from 'shared/types';

export type SpotlightResult =
  | {
      type: 'command';
      id: string;
      data: {
        command: (typeof commandDefs)[number];
      };
    }
  | {
      type: 'gitlab-issue';
      id: string;
      data: {
        issueId: number;
      };
    }
  | {
      type: 'form';
      id: string;
      data: {
        form: SavedForm;
      };
    };

export async function generateResults(settings: Settings, input: string) {
  return [
    ...generateCommandResults(settings, input),
    ...generateGitlabIssueResults(settings, input),
    ...(await generateFormResults(settings, input)),
  ];
}

function generateCommandResults(
  _settings: Settings,
  input: string,
): Extract<SpotlightResult, { type: 'command' }>[] {
  if (input[0] !== '>') {
    return [];
  }
  input = input.slice(1);
  return commandDefs
    .filter((command) => searchText(command.label, input))
    .map((command) => ({
      type: 'command',
      id: `command-${command.key}`,
      data: { command },
    }));
}

function generateGitlabIssueResults(
  settings: Settings,
  input: string,
): Extract<SpotlightResult, { type: 'gitlab-issue' }>[] {
  if (
    !settings.modules.gitlab.config.host ||
    !settings.modules.gitlab.config.project
  ) {
    return [];
  }
  const ids = input.match(/\b\d{4}\b/g)?.map((id) => parseInt(id)) ?? [];
  const distinctIds = Array.from(new Set(ids));
  return distinctIds.map((id) => ({
    type: 'gitlab-issue',
    id: `gitlab-issue-${id}`,
    data: { issueId: id },
  }));
}

async function generateFormResults(
  _settings: Settings,
  input: string,
): Promise<Extract<SpotlightResult, { type: 'form' }>[]> {
  if (input[0] !== '#') {
    return [];
  }
  input = input.slice(1);
  const forms = (await loadStorageValue(StorageKeys.FORMS)) || [];
  return forms
    .filter((form) => form.host === getHost())
    .filter((form) => form.label.length > 0)
    .filter((form) => searchText(form.label, input))
    .map((form) => ({
      type: 'form',
      id: `form-${form.label}`,
      data: { form },
    }));
}

function searchText(text: string, search: string) {
  return new RegExp(search, 'i').test(text);
}
