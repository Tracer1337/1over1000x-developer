import { Event } from 'shared/bridge';
import { loadChatGPTClient } from 'shared/chatgpt';
import { prompts } from 'shared/chatgpt';
import { StorageKeys } from 'shared/storage';

type CreateTabGroupEvent = Extract<Event, { event: 'create-tab-group' }>;

export async function createTabGroup(
  event: CreateTabGroupEvent,
  sender: chrome.runtime.MessageSender,
) {
  const tabIds = await collectTabs(event, sender);
  const groupId = await chrome.tabs.group({ tabIds });
  chrome.tabGroups.update(groupId, { color: 'blue' });
  handleTabGroupTitle(event.data.title, (title) =>
    chrome.tabGroups.update(groupId, { title }),
  );
}

async function collectTabs(
  event: CreateTabGroupEvent,
  sender: chrome.runtime.MessageSender,
) {
  const issueTab = sender.tab;
  if (!issueTab) {
    throw new Error('Sender tab is not set');
  }
  const mrTab = event.data.mrUrl
    ? await chrome.tabs.create({ url: event.data.mrUrl, active: false })
    : null;
  return [issueTab.id, mrTab?.id].filter(
    (id): id is number => id !== undefined,
  );
}

async function handleTabGroupTitle(
  title: string,
  render: (text: string) => void,
) {
  const cancelLoading = loadingAnimation(render);
  const tabGroupTitle = await loadTabGroupTitle(title);
  cancelLoading();
  render(tabGroupTitle);
}

async function loadTabGroupTitle(title: string) {
  const cacheStorage = (
    await chrome.storage.local.get(StorageKeys.TAB_GROUP_TITLES)
  )[StorageKeys.TAB_GROUP_TITLES];
  const cache = cacheStorage ? JSON.parse(cacheStorage) : {};
  if (title in cache) {
    return cache[title];
  }
  const api = await loadChatGPTClient();
  if (!api) {
    return;
  }
  const prompt = prompts.tapGroupTitle.replace('{0}', title);
  const res = await api.sendMessage(prompt);
  cache[title] = res.text;
  chrome.storage.local.set({
    [StorageKeys.TAB_GROUP_TITLES]: JSON.stringify(cache),
  });
  return cache[title];
}

function loadingAnimation(render: (text: string) => void) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let isRunning = true;
  let currentFrame = 0;

  const animate = () => {
    if (!isRunning) {
      return;
    }
    render(frames[currentFrame++ % frames.length]);
    setTimeout(animate, 80);
  };

  animate();

  return () => {
    isRunning = false;
  };
}
