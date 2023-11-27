const handlers: Record<string, () => void> = {
  spotlight: handleSpotlightCommand,
};

export function handleCommand(command: string) {
  handlers[command]?.();
}

async function handleSpotlightCommand() {
  chrome.windows.create({
    focused: true,
    width: 450,
    height: 600,
    type: 'popup',
    url: chrome.runtime.getURL('/spotlight.html'),
  });
}
