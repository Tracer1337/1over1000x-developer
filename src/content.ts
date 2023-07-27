import { isEvent, runRouteHandlers } from 'lib/bridge';
import modules from 'modules';

chrome.runtime.onMessage.addListener((message) => {
  if (!isEvent(message)) {
    return;
  }
  switch (message.event) {
    case 'navigation-change':
      runRouteHandlers();
  }
});

modules.forEach((setup) => setup());
runRouteHandlers();

console.info(
  '%cYou are now a 1/1000x Developer🥳',
  'font-size: 18px; font-weight: bold; color: green;',
);
