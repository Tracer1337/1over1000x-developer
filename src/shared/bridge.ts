import { Command, Module } from './types';
import { SavedForm, Settings } from './storage';
import { useCallback, useEffect, useState } from 'react';
import { getHost } from './dom';

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
        loading: boolean;
      };
    }
  | { type: `command.${Command}` }
  | { type: 'page-info.request' }
  | {
      type: 'page-info.response';
      data: {
        hasForm: boolean;
        host: string;
      };
    }
  | { type: 'form.save' }
  | {
      type: 'form.load';
      data: SavedForm;
    }
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

export function isModuleActive(moduleSettings: Settings['modules'][Module]) {
  return (
    moduleSettings.enabled &&
    (moduleSettings.hosts.includes(location.host) ||
      moduleSettings.hosts.includes(getHost()))
  );
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

export function usePageInfo() {
  const [pageInfo, setPageInfo] =
    useState<Extract<Event, { type: 'page-info.response' }>['data']>();

  const handleMessage = useCallback((event: unknown) => {
    if (!isEvent(event) || event.type !== 'page-info.response') {
      return;
    }
    setPageInfo(event.data);
  }, []);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    getCurrentTab().then((currentTab) => {
      if (currentTab.id === undefined) {
        return;
      }
      const event: Event = {
        senderId,
        type: 'page-info.request',
      };
      chrome.tabs.sendMessage(currentTab.id, event).catch(() => {});
    });
  }, []);

  return pageInfo;
}

export function emitPageInfo() {
  const detectForm = () => document.querySelector('form') !== null;

  const event: Event = {
    senderId,
    type: 'page-info.response',
    data: {
      hasForm: detectForm(),
      host: getHost(),
    },
  };

  chrome.runtime.sendMessage(event);
}
