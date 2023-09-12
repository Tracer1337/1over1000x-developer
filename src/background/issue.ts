import { ChatGPTAPI } from 'chatgpt';
import { loadChatGPTClient, prompts } from 'shared/chatgpt';
import { StorageKeys, UserStory, saveStorageValue } from 'shared/storage';

export async function createIssue(input: string | undefined) {
  const api = await loadChatGPTClient();

  if (!input || !api) {
    throw new Error('Missing input text');
  }

  await saveStorageValue(StorageKeys.USER_STORY, {
    loading: true,
    data: null,
  });

  chrome.tabs.create({
    url: 'https://gitlab.dzh.hamburg/theraos/app/-/issues/new',
  });

  await saveStorageValue(StorageKeys.USER_STORY, {
    loading: false,
    data: await loadUserStory(input, api),
  });
}

async function loadUserStory(input: string, api: ChatGPTAPI) {
  const prompt = prompts.userStory.replace('{0}', input);
  const res = await api.sendMessage(prompt);
  return JSON.parse(res.text) as UserStory['data'];
}
