export interface Observable {
  subscribe(subscribeInfo: SubscribeObject | ObserverFunction): void;
  unsubscribe(subscribeInfo: SubscribeObject | ObserverFunction): void;
  start?(): void;
  stop?(): void;
}

export type ObserverFunction = () => void;

export type SubscribeObject = {
  element: HTMLDivElement;
  eventName: "touchmove" | "touchend";
  callback: (evnet: TouchEvent) => void;
};
