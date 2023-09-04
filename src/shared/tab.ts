import { StorageKeys } from './storage';

export type TabGroup = {
  name: string;
  tabs: { url: string }[];
};

export async function loadTabGroups(): Promise<TabGroup[]> {
  const json = (await chrome.storage.local.get(StorageKeys.TAB_GROUPS))[
    StorageKeys.TAB_GROUPS
  ];
  return json ? JSON.parse(json) : [];
}

export async function saveTabGroups(tabGroups: TabGroup[]) {
  await chrome.storage.local.set({
    [StorageKeys.TAB_GROUPS]: JSON.stringify(tabGroups),
  });
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
  await saveTabGroups(newTabGroups);
}

export async function removeTabGroup(index: number) {
  const tabGroups = await loadTabGroups();
  tabGroups.splice(index, 1);
  await saveTabGroups(tabGroups);
}

export async function openTabGroup(group: TabGroup) {
  await Promise.all(
    group.tabs.map((tab, index) => chrome.tabs.create({ url: tab.url, index })),
  );
}
