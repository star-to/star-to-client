export interface Observable {
  subscribe(subscribeInfo: SubscribeObject): void;
  unsubscribe(subscribeInfo: SubscribeObject): void;
  start(): void;
  stop(): void;
}

export type ObserverFunction = () => void;

export type SubscribeObject = {
  element: HTMLDivElement;
  eventName: string;
  callback: (evnet: TouchEvent) => void;
};
