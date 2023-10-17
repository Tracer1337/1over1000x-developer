import { Event, getCurrentTab, senderId } from 'shared/bridge';
import { SavedForm } from 'shared/storage';

export function useLoadForm() {
  const loadForm = (form: SavedForm) => {
    getCurrentTab().then((currentTab) => {
      if (currentTab.id === undefined) {
        return;
      }
      const event: Event = {
        senderId,
        type: 'form.load',
        data: form,
      };
      chrome.tabs.sendMessage(currentTab.id, event).catch(() => {});
    });
  };
  return loadForm;
}
