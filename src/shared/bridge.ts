export const senderId = '1/1000x-developer';

export type Event = { senderId: string } & (
  | {
      event: 'navigation-change';
    }
  | {
      event: 'create-tab-group';
      data: {
        title: string;
        mrUrl?: string;
      };
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
