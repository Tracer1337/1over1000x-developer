import { isEvent } from 'shared/bridge';
import { chatGPTPolyfill } from 'shared/chatgpt';
import { createContextMenu, handleContextMenuClick } from './menu';
import { createTabGroup, emitNavigationChange, reloadAllTabs } from './tab';
import {
  startScreenCapture,
  stopScreenCapture,
  transmitScreenCapture,
} from './capture';

chatGPTPolyfill();

chrome.runtime.onInstalled.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.webNavigation.onHistoryStateUpdated.addListener(emitNavigationChange);

chrome.runtime.onMessage.addListener((event, sender) => {
  if (!isEvent(event)) {
    return;
  }

  switch (event.type) {
    case 'tab-group.create':
      return createTabGroup(event, sender);
    case 'capture.start':
      return startScreenCapture();
    case 'capture.stop':
      return stopScreenCapture?.();
    case 'capture.transmit-recording':
      return transmitScreenCapture?.(event.data.url);
    case 'command.reload-tabs':
      return reloadAllTabs();
  }
});
