import { Event, getCurrentTab, isEvent, senderId } from 'shared/bridge';
import { chatGPTPolyfill } from 'shared/chatgpt';
import { createTabGroup } from './tab';
import {
  startScreenCapture,
  stopScreenCapture,
  transmitScreenCapture,
} from './capture';

chatGPTPolyfill();

chrome.webNavigation.onHistoryStateUpdated.addListener(async () => {
  const currentTab = await getCurrentTab();
  if (currentTab.id === undefined) {
    return;
  }
  const event: Event = { senderId, type: 'navigation.change' };
  chrome.tabs.sendMessage(currentTab.id, event).catch(() => {});
});

chrome.runtime.onMessage.addListener((event, sender) => {
  if (!isEvent(event)) {
    return;
  }

  switch (event.type) {
    case 'tab-group.create':
      return createTabGroup(event, sender);
    case 'capture.start':
      return startScreenCapture();
    case 'capture.stop':
      return stopScreenCapture?.();
    case 'capture.transmit-recording':
      return transmitScreenCapture?.(event.data.url);
  }
});
