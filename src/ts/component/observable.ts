export interface Observable {
  subscribe(key: string, cb: ObserverFunction): void;
  unsubscribe(key: string, cb: ObserverFunction): void;
  notify(key: string, state: State | State[]): void;
}

export type ObserverFunction = (state?: State | State[]) => void;

export type State = {
  [key: string]: string | number | State | State[];
};
