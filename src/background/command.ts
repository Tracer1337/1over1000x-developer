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
  chrome.windows.create({
    focused: true,
    width: 450,
    height: 600,
    type: 'popup',
    url: 'chrome-extension://dhldkgjggdacbkhlpkmmipfmhaboanep/spotlight.html',
  });
}
