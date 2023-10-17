import { emitPageInfo, isEvent, runRouteHandlers } from 'shared/bridge';
import setupGitlabModule from 'content/modules/gitlab';
import setupSpotlightModule from 'content/modules/spotlight';
import { Module, moduleDefs } from 'shared/types';
import { loadSettings } from 'shared/settings';
import { loadForm, saveForm } from 'shared/form';

const moduleSetup: Record<Module, () => void> = {
  gitlab: setupGitlabModule,
  spotlight: setupSpotlightModule,
};

chrome.runtime.onMessage.addListener((event) => {
  if (!isEvent(event)) {
    return;
  }
  switch (event.type) {
    case 'navigation.change':
      return runRouteHandlers();
    case 'page-info.request':
      return emitPageInfo();
    case 'form.save':
      return saveForm();
    case 'form.load':
      return loadForm(event.data);
  }
});

async function setup() {
  const settings = await loadSettings();
  moduleDefs.forEach((module) => {
    if (settings.modules[module.key]) {
      moduleSetup[module.key]();
    }
  });
  runRouteHandlers();
}

setup();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
