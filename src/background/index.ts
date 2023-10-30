import { addExtensionListener, sendExtensionMessage } from 'shared/bridge';
import { chatGPTPolyfill } from 'shared/chatgpt';
import { createContextMenu, handleContextMenuClick } from './menu';
import { createTabGroup, reloadAllTabs } from './tab';
import {
  startScreenCapture,
  stopScreenCapture,
  transmitScreenCapture,
} from './capture';
import { handleCommand } from './command';
import { openChatGPT } from './chatgpt';

chatGPTPolyfill();

chrome.runtime.onInstalled.addListener(createContextMenu);

chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

chrome.commands.onCommand.addListener(handleCommand);

chrome.webNavigation.onHistoryStateUpdated.addListener(() =>
  sendExtensionMessage('navigation.change').toCurrentTab(),
);

addExtensionListener('tab-group.create', createTabGroup);
addExtensionListener('capture.start', startScreenCapture);
addExtensionListener('capture.stop', () => stopScreenCapture?.());
addExtensionListener('capture.transmit-recording', (event) =>
  transmitScreenCapture?.(event),
);
addExtensionListener('command.reload-tabs', reloadAllTabs);
addExtensionListener('chatgpt.open', openChatGPT);
