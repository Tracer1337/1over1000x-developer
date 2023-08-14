import { ChatGPTAPI } from 'chatgpt';
import { StorageKeys } from './storage';

export function chatGPTPolyfill() {
  self.Buffer = {
    // @ts-ignore
    isBuffer: () => false,
  };
}

export async function loadChatGPTClient() {
  const apiKey = await getChatGPTApiKey();
  return apiKey
    ? new ChatGPTAPI({ apiKey, fetch: self.fetch.bind(self) })
    : null;
}

async function getChatGPTApiKey() {
  const apiKey = (await chrome.storage.local.get(StorageKeys.CHATGPT_TOKEN))[
    StorageKeys.CHATGPT_TOKEN
  ];
  if (apiKey) {
    return apiKey;
  }
  chrome.runtime.openOptionsPage();
}

export const prompts = {
  tapGroupTitle: `
    Fasse den folgenden Titel in einem Wort zusammen. Deine Antwort darf nur ein Wort beinhalten. Der Titel lautet: "{0}"
  `,
};
