export const senderId = '1/1000x-developer';

export type Event = { senderId: string } & {
  event: 'navigation-change';
};

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
  callback: () => void;
};

const handlers: Array<RouteHandler> = [];

export function registerRouteHandler(handler: RouteHandler) {
  handlers.push(handler);
}

export function runRouteHandlers() {
  handlers
    .filter(({ path }) => path.test(location.href))
    .forEach(({ callback }) => callback());
}
