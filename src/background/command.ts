import { sendExtensionMessage } from 'shared/bridge';
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
  const currentWindow = await chrome.windows.getLastFocused();
  if (!currentWindow?.id) {
    return;
  }
  chrome.windows.update(currentWindow.id, { focused: true });
  sendExtensionMessage('spotlight.launch').toCurrentTab();
}
