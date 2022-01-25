export interface Observable {
  subscribe(key: string, cb: ObserverFunction): void;
  unsubscribe(key: string, cb: ObserverFunction): void;
  notify(key: string, params: State | State[]): void;
}

export type ObserverFunction = (params?: State | State[] | Option) => void;

export type State = {
  [key: string]: string | number | State | State[];
};
