import { Event, getCurrentTab, senderId } from 'shared/bridge';

export function useSaveForm() {
  const saveForm = () => {
    getCurrentTab().then((currentTab) => {
      if (currentTab.id === undefined) {
        return;
      }
      const event: Event = {
        senderId,
        type: 'form.save',
      };
      chrome.tabs.sendMessage(currentTab.id, event).catch(() => {});
    });
  };
  return saveForm;
}
