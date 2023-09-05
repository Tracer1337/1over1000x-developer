import { Command } from './types';
import { Settings } from './storage';

export const senderId = '1/1000x-developer';

export type Event = { senderId: string } & (
  | { type: 'navigation.change' }
  | {
      type: 'tab-group.create';
      data: {
        title: string;
        issueId: number;
        mrUrl: string | null;
      };
    }
  | { type: 'capture.start' }
  | { type: 'capture.stop' }
  | {
      type: 'capture.start-recording';
      data: {
        streamId: string;
        settings: Settings;
      };
    }
  | { type: 'capture.stop-recording' }
  | {
      type: 'capture.transmit-recording';
      data: {
        url: string;
      };
    }
  | {
      type: 'capture.process';
      data: {
        progress: number;
      };
    }
  | { type: `command.${Command}` }
);

export function isEvent(object: unknown): object is Event {
  return (
    typeof object === 'object' &&
    object !== null &&
    'senderId' in object &&
    object.senderId === senderId
  );
}

type RouteHandler = {
  path: RegExp;
  callback: () => void | (() => void);
};

const handlers: Array<RouteHandler> = [];
const cleanupHandlers: Array<ReturnType<RouteHandler['callback']>> = [];

export function registerRouteHandler(handler: RouteHandler) {
  handlers.push(handler);
}

export function runRouteHandlers() {
  cleanupHandlers.forEach((handler) => handler?.());
  cleanupHandlers.length = 0;
  handlers.forEach(
    ({ path, callback }) =>
      path.test(location.href) && cleanupHandlers.push(callback()),
  );
}

export function createRenderLoop(callback: () => void, interval = 200) {
  const intervalId = setInterval(callback, interval);
  callback();
  return () => clearInterval(intervalId);
}

export async function resetIcon() {
  await chrome.action.setIcon({
    path: {
      16: 'icons/icon_16.png',
      32: 'icons/icon_32.png',
      48: 'icons/icon_48.png',
      128: 'icons/icon_128.png',
    },
  });
}

export async function getCurrentTab() {
  return new Promise<chrome.tabs.Tab>((resolve, reject) =>
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        reject('Could not find current tab');
        return;
      }
      resolve(tabs[0]);
    }),
  );
}
