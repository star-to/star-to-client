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
    // eslint-disable-next-line no-console
    console.log("구독", this.observers);
  }

  unsubscribe(key: string, cb: ObserverFunction): void {
    this.observers[key] = this.observers[key].filter((e) => e !== cb);
    // eslint-disable-next-line no-console
    console.log("구독해제", this.observers);
  }

  notify(key: string): void {
    this.observers[key].forEach((cb) => cb());
  }
}

type Observers = {
  [key: string]: ObserverFunction[];
};
