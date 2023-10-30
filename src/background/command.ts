import { loadSettings } from 'shared/settings';

const handlers: Record<string, () => void> = {
  spotlight: handleSpotlightCommand,
};

export function handleCommand(command: string) {
  handlers[command]?.();
}

async function handleSpotlightCommand() {
  const settings = await loadSettings();
  if (!settings.modules.spotlight.enabled) {
    return;
  }
  const width = 600;
  const height = 600;
  chrome.windows.create({
    focused: true,
    width,
    height,
    type: 'popup',
    url: 'chrome-extension://dhldkgjggdacbkhlpkmmipfmhaboanep/spotlight.html',
  });
}
