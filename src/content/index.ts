import {
  addExtensionListener,
  emitPageInfo,
  runRouteHandlers,
} from 'shared/bridge';
import setupGitlabModule from 'content/modules/gitlab';
import { Module, moduleDefs } from 'shared/types';
import { loadSettings } from 'shared/settings';
import { loadForm, saveForm } from 'shared/form';

const moduleSetup: Partial<Record<Module, () => void>> = {
  gitlab: setupGitlabModule,
};

addExtensionListener('navigation.change', runRouteHandlers);
addExtensionListener('page-info.request', emitPageInfo);
addExtensionListener('form.save', saveForm);
addExtensionListener('form.load', (event) => loadForm(event.data));

async function setup() {
  const settings = await loadSettings();
  moduleDefs
    .filter((module) => settings.modules[module.key].enabled)
    .map((module) => moduleSetup[module.key]?.());
  runRouteHandlers();
}

setup();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
