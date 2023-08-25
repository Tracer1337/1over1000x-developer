import { Event, senderId } from 'shared/bridge';

export function useStartScreenCapture() {
  const startScreenCapture = () => {
    const event: Event = {
      senderId,
      type: 'capture.start',
    };
    chrome.runtime.sendMessage(event);
    window.close();
  };

  return startScreenCapture;
}
