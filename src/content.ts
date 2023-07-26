import { isEvent } from 'lib/bridge';
import modules from 'modules';

chrome.runtime.onMessage.addListener((message) => {
  if (!isEvent(message)) {
    return;
  }
  switch (message.event) {
    case 'navigation-change':
      setupModules();
  }
});

function setupModules() {
  modules
    .filter(({ path }) => path.test(location.href))
    .forEach(({ setup }) => setup());
}

setupModules();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
