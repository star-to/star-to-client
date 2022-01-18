export interface Observable {
  subscribe(fn: ObserverFunction): void;
  unsubscribe(fn: ObserverFunction): void;
  start?(): void;
  stop?(): void;
}

export type ObserverFunction = () => void;
