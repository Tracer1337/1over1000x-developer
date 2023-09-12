import {
  StorageKeys,
  TabGroup,
  loadStorageValue,
  saveStorageValue,
} from './storage';

export async function loadTabGroups(): Promise<TabGroup[]> {
  const tabGroups = await loadStorageValue(StorageKeys.TAB_GROUPS);
  return tabGroups ?? [];
}

export async function saveCurrentTabs(name: string) {
  const tabGroups = await loadTabGroups();
  const currentTabs = await chrome.tabs.query({ currentWindow: true });
  const newTabGroups: TabGroup[] = [
    ...tabGroups,
    {
      name,
      tabs: currentTabs.map((tab) => ({
        url: tab.url ?? '',
      })),
    },
  ];
  await saveStorageValue(StorageKeys.TAB_GROUPS, newTabGroups);
}

export async function removeTabGroup(index: number) {
  const tabGroups = await loadTabGroups();
  tabGroups.splice(index, 1);
  await saveStorageValue(StorageKeys.TAB_GROUPS, tabGroups);
}

export async function openTabGroup(group: TabGroup) {
  await Promise.all(
    group.tabs.map((tab, index) => chrome.tabs.create({ url: tab.url, index })),
  );
}
