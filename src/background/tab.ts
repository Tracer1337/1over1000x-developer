import qs from 'qs';
import { Event, getCurrentTab, senderId } from 'shared/bridge';
import { loadChatGPTClient } from 'shared/chatgpt';
import { prompts } from 'shared/chatgpt';
import { getGitLabProjectUrl } from 'shared/gitlab';

type CreateTabGroupEvent = Extract<Event, { type: 'tab-group.create' }>;

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
    : await chrome.tabs.create({
        url: getCreateMrUrl(event.data.issueUrl, event.data.issueId),
      });
  return [issueTab.id, mrTab?.id].filter(
    (id): id is number => id !== undefined,
  );
}

function getCreateMrUrl(issueUrl: string, issueId: number) {
  const params = {
    merge_request: {
      source_project_id: '152',
      source_branch: issueId,
      target_project_id: '152',
      target_branch: 'master',
    },
  };
  return `${getGitLabProjectUrl(issueUrl)}-/merge_requests/new?${qs.stringify(
    params,
  )}`;
}

async function handleTabGroupTitle(
  title: string,
  render: (text: string) => void,
) {
  const cancelLoading = loadingAnimation(render);
  const tabGroupTitle = await loadTabGroupTitle(title);
  cancelLoading();
  if (tabGroupTitle) {
    render(tabGroupTitle);
  }
}

async function loadTabGroupTitle(title: string) {
  const api = await loadChatGPTClient();
  if (!api) {
    return;
  }
  const prompt = prompts.tapGroupTitle.replace('{0}', title);
  const res = await api.sendMessage(prompt, {
    completionParams: {
      temperature: 0,
    },
  });
  return res.text;
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

export async function reloadAllTabs() {
  const window = await chrome.windows.getLastFocused({
    windowTypes: ['normal'],
  });
  if (!window?.id) {
    return;
  }
  const tabs = await chrome.tabs.query({ windowId: window.id });
  tabs.map((tab) => (tab.id === undefined ? null : chrome.tabs.reload(tab.id)));
}
