import { Event, isEvent, senderId } from 'shared/bridge';

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

chrome.runtime.onMessage.addListener((message, sender) => {
  if (!isEvent(message)) {
    return;
  }

  switch (message.event) {
    case 'create-tab-group':
      createTabGroup(message, sender);
  }
});

async function createTabGroup(
  event: Extract<Event, { event: 'create-tab-group' }>,
  sender: chrome.runtime.MessageSender,
) {
  const issueTab = sender.tab;
  if (!issueTab) {
    return;
  }
  const mrTab = event.data.mrUrl
    ? await chrome.tabs.create({ url: event.data.mrUrl, active: false })
    : null;
  const tabIds = [issueTab.id, mrTab?.id].filter(
    (id): id is number => id !== undefined,
  );
  const groupId = await chrome.tabs.group({ tabIds });
  chrome.tabGroups.update(groupId, { color: 'blue', title: event.data.title });
}
