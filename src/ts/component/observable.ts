export interface Observable {
  subscribe(key: string, cb: ObserverFunction): void;
  unsubscribe(key: string, cb: ObserverFunction): void;
  notify(key: string, params: notifyParam): void;
}

export type notifyParam = State | State[] | KakaoOption | boolean | KakaoLatLng;

export type ObserverFunction = (params?: notifyParam) => void;

export type State = {
  [key: string]: string | number | State | State[];
};
