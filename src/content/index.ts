import {
  addExtensionListener,
  emitPageInfo,
  runRouteHandlers,
} from 'shared/bridge';
import { Module, moduleDefs } from 'shared/types';
import { addSettingsListener, loadSettings } from 'shared/settings';
import { loadForm, saveForm } from 'shared/form';
import setupGitlabModule from 'content/modules/gitlab';
import setupCaptureModule from 'content/modules/capture';
import setupTheveaModule from 'thevea/content';
import setupDesignerModule from 'designer/content';
import { Settings } from 'shared/storage';

const moduleSetupFunctions: Record<Module, () => (() => void) | void> = {
  gitlab: setupGitlabModule,
  thevea: setupTheveaModule,
  designer: setupDesignerModule,
};

const moduleDestroyHandlers: Partial<Record<Module, (() => void) | void>> = {};

addExtensionListener('navigation.change', runRouteHandlers);
addExtensionListener('page-info.request', emitPageInfo);
addExtensionListener('form.save', saveForm);
addExtensionListener('form.load', (event) => loadForm(event.data));

function setup() {
  loadSettings().then(handleSettings);
  addSettingsListener(handleSettings);
  runRouteHandlers();
  setupCaptureModule();
}

function handleSettings(settings: Settings) {
  moduleDefs.forEach((module) => {
    if (settings.modules[module.key].enabled) {
      moduleDestroyHandlers[module.key] = moduleSetupFunctions[module.key]();
    } else {
      moduleDestroyHandlers[module.key]?.();
      delete moduleDestroyHandlers[module.key];
    }
  });
}

setup();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
