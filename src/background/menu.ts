import { createIssue } from './issue';

export function createContextMenu() {
  chrome.contextMenus.create({
    id: 'root',
    contexts: ['all'],
    title: '1/1000x Developer',
  });

  chrome.contextMenus.create({
    id: 'user-story',
    parentId: 'root',
    contexts: ['selection'],
    title: 'Create User-Story',
  });
}

export function handleContextMenuClick(info: chrome.contextMenus.OnClickData) {
  if (info.menuItemId === 'user-story') {
    createIssue(info.selectionText);
  }
}
