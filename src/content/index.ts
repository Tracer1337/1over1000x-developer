import { isEvent, runRouteHandlers } from 'shared/bridge';
import setupGitlabModule from 'content/modules/gitlab';
import setupSpotlightModule from 'content/modules/spotlight';

chrome.runtime.onMessage.addListener((message) => {
  if (!isEvent(message)) {
    return;
  }
  switch (message.type) {
    case 'navigation.change':
      return runRouteHandlers();
  }
});

function setup() {
  setupGitlabModule();
  setupSpotlightModule();
  runRouteHandlers();
}

setup();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
