import { Command } from './types';
import { SavedForm, Settings } from './storage';
import { useEffect, useState } from 'react';
import { getHost } from './dom';

export const senderId = '1/1000x-developer';

export type Event = { senderId: string } & (
  | { type: 'navigation.change' }
  | {
      type: 'tab-group.create';
      data: {
        title: string;
        issueUrl: string;
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
  | {
      type: 'chatgpt.open';
      data: {
        prompt: string;
      };
    }
);

type EventData<T> = Extract<Event, { type: T }> extends { data: infer D }
  ? D
  : undefined;

function isEventOfType<T extends Event['type']>(
  obj: any,
  type: T,
): obj is Extract<Event, { type: T }> {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.type === type &&
    obj.senderId === senderId
  );
}

export function addExtensionListener<T extends Event['type']>(
  type: T,
  callback: (
    event: Extract<Event, { type: T }>,
    sender: chrome.runtime.MessageSender,
  ) => void,
) {
  const handler = (event: unknown, sender: chrome.runtime.MessageSender) => {
    if (isEventOfType(event, type)) {
      callback(event, sender);
    }
  };
  chrome.runtime.onMessage.addListener(handler);
  return () => {
    chrome.runtime.onMessage.removeListener(handler);
  };
}

type ExtensionMessageForwarders = {
  toCurrentTab: () => void;
};

export function sendExtensionMessage(
  type: Extract<
    Event,
    {
      type: string;
      data?: never;
    }
  >['type'],
): ExtensionMessageForwarders;
export function sendExtensionMessage<T extends Event['type']>(
  type: T,
  data: EventData<T>,
): ExtensionMessageForwarders;
export function sendExtensionMessage<T extends Event['type']>(
  type: T,
  data?: any,
) {
  const event = {
    senderId,
    type,
    ...(data ? { data } : {}),
  };

  chrome.runtime.sendMessage(event).catch(() => {});

  const forwarders: ExtensionMessageForwarders = {
    toCurrentTab: async () => {
      const currentTab = await getCurrentTab();
      if (currentTab.id !== undefined) {
        chrome.tabs.sendMessage(currentTab.id, event).catch(() => {});
      }
    },
  };

  return forwarders;
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

export function usePageInfo() {
  const [pageInfo, setPageInfo] =
    useState<Extract<Event, { type: 'page-info.response' }>['data']>();

  useEffect(
    () =>
      addExtensionListener('page-info.response', (event) =>
        setPageInfo(event.data),
      ),
    [],
  );

  useEffect(() => {
    sendExtensionMessage('page-info.request').toCurrentTab();
  }, []);

  return pageInfo;
}

export function emitPageInfo() {
  const detectForm = () => document.querySelector('form') !== null;

  sendExtensionMessage('page-info.response', {
    hasForm: detectForm(),
    host: getHost(),
  });
}
