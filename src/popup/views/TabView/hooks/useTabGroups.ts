import { useCallback, useEffect, useState } from 'react';
import { StorageKeys } from 'shared/storage';
import { TabGroup, loadTabGroups } from 'shared/tab';

export function useTabGroups() {
  const [tabGroups, setTabGroups] = useState<TabGroup[] | null>(null);

  const handleStorageChange = useCallback(
    (changes: { [key: string]: chrome.storage.StorageChange }) => {
      const newTabGroups: string | undefined =
        changes[StorageKeys.TAB_GROUPS]?.newValue;
      if (!newTabGroups) {
        return;
      }
      setTabGroups(JSON.parse(newTabGroups));
    },
    [],
  );

  useEffect(() => {
    loadTabGroups().then(setTabGroups);
    chrome.storage.local.onChanged.addListener(handleStorageChange);
    return () => {
      chrome.storage.local.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return tabGroups;
}
