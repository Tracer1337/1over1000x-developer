import { Event, isEvent, senderId } from 'shared/bridge';
import { chatGPTPolyfill } from 'shared/chatgpt';
import { createTabGroup } from './tab';

chatGPTPolyfill();

chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0]?.id;
    if (!tabId) {
      return;
    }
    const event: Event = { senderId, type: 'navigation.change' };
    chrome.tabs.sendMessage(tabId, event).catch(() => {});
  });
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!isEvent(message)) {
    return;
  }

  switch (message.type) {
    case 'tab-group.create':
      createTabGroup(message, sender);
  }
});
