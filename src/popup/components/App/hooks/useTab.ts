import { useEffect, useState } from 'react';
import { StorageKeys } from 'shared/storage';

export function useTab() {
  const [tab, setTab] = useState<number | null>(null);

  useEffect(() => {
    chrome.storage.local
      .get(StorageKeys.POPUP_TAB)
      .then((storage) => setTab(storage[StorageKeys.POPUP_TAB] ?? 0));
  }, []);

  const updateTab = (newTab: number) => {
    chrome.storage.local
      .set({ [StorageKeys.POPUP_TAB]: newTab })
      .then(() => setTab(newTab));
  };

  return [tab, updateTab] as const;
}
