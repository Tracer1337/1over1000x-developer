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
