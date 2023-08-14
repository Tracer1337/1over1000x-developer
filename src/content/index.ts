import { isEvent, runRouteHandlers } from 'shared/bridge';
import setupGitlabModule from 'content/modules/gitlab';

chrome.runtime.onMessage.addListener((message) => {
  if (!isEvent(message)) {
    return;
  }
  switch (message.event) {
    case 'navigation-change':
      runRouteHandlers();
  }
});

function setup() {
  setupGitlabModule();
  runRouteHandlers();
}

setup();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
