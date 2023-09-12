import { isEvent, runRouteHandlers } from 'shared/bridge';
import setupGitlabModule from 'content/modules/gitlab';
import setupSpotlightModule from 'content/modules/spotlight';
import { Module, moduleDefs } from 'shared/types';
import { loadSettings } from 'shared/settings';

const moduleSetup: Record<Module, () => void> = {
  gitlab: setupGitlabModule,
  spotlight: setupSpotlightModule,
};

chrome.runtime.onMessage.addListener((message) => {
  if (!isEvent(message)) {
    return;
  }
  switch (message.type) {
    case 'navigation.change':
      return runRouteHandlers();
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
