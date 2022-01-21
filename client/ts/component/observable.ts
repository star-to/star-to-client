export interface Observable {
  subscribe(key: string, cb: ObserverFunction): void;
  unsubscribe(key: string, cb: ObserverFunction): void;
  notify(key: string): void;
}

export type ObserverFunction = () => void;
