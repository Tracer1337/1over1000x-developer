import { Event, senderId } from 'lib/bridge';

chrome.webNavigation.onHistoryStateUpdated.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tabId = tabs[0]?.id;
    if (!tabId) {
      return;
    }
    const event: Event = { senderId, event: 'navigation-change' };
    chrome.tabs.sendMessage(tabId, event).catch(() => {});
  });
});
