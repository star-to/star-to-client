import { Observable, ObserverFunction } from "../observable";

export default class Action implements Observable {
  private observers: Observers;

  constructor() {
    this.observers = {};
  }

  createObservers(key: string) {
    const existKey = Object.keys(this.observers).includes(key);
    if (existKey) return;

    this.observers[key] = [];
  }

  subscribe(key: string, cb: ObserverFunction): void {
    this.observers[key].push(cb);
  }

  unsubscribe(key: string, cb: ObserverFunction): void {
    this.observers[key] = this.observers[key].filter((e) => e !== cb);
  }

  notify(key: string, params?: any): void {
    this.observers[key].forEach((cb) => {
      params ? cb(params) : cb();
    });
  }
}

type Observers = {
  [key: string]: ObserverFunction[];
};
