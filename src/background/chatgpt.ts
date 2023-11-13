import { Event } from 'shared/bridge';

export async function openChatGPT(
  event: Extract<Event, { type: 'chatgpt.open' }>,
) {
  const tab = await chrome.tabs.create({
    url: 'https://chat.openai.com/?model=gpt-4',
  });
  if (!tab.id) {
    return;
  }
  await waitForTabLoad(tab.id);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: injectPrompt,
    args: [event.data.prompt],
  });
}

function waitForTabLoad(tabId: number) {
  return new Promise<void>((resolve) => {
    const handleMessage = (
      _tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
    ) => {
      if (_tabId !== tabId || changeInfo.status !== 'complete') {
        return;
      }
      resolve();
      chrome.tabs.onUpdated.removeListener(handleMessage);
    };
    chrome.tabs.onUpdated.addListener(handleMessage);
  });
}

async function injectPrompt(prompt: string) {
  while (
    !document
      .querySelector<HTMLTextAreaElement>('#prompt-textarea')
      ?.placeholder?.startsWith('Message ChatGPT')
  ) {
    await new Promise(requestAnimationFrame);
  }
  const promptInput =
    document.querySelector<HTMLTextAreaElement>('#prompt-textarea');
  const sendButton = document.querySelector<HTMLButtonElement>(
    '[data-testid="send-button"]',
  );
  if (!promptInput || !sendButton) {
    return;
  }
  while (sendButton.disabled) {
    promptInput.value = prompt;
    promptInput.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise(requestAnimationFrame);
  }
  sendButton.click();
}
