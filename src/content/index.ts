import { isEvent, runRouteHandlers } from 'shared/bridge';
import setupGitlabModule from 'content/modules/gitlab';
import setupSpotlightModule from 'content/modules/spotlight';
import { Settings, loadSettings } from 'shared/storage';

const modules: Record<keyof Settings['modules'], () => void> = {
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
  Object.entries(modules).forEach(([name, setup]) => {
    if (settings.modules[name as keyof Settings['modules']]) {
      setup();
    }
  });
  runRouteHandlers();
}

setup();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
