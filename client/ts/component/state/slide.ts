import { Observable, ObserverFunction, SubscribeObject } from "./observable";

export class TouchSlide implements Observable {
  private startObservers: ObserverFunction[];
  private stopObservers: ObserverFunction[];

  constructor() {
    this.startObservers = [];
    this.stopObservers = [];
  }

  subscribe(eventObject: SubscribeObject): void {
    const { element, eventName, callback } = eventObject;

    const eventType = eventName === "touchmove" ? "touchmove" : "touchend";
    //TODO: 왜이렇게 되는지 궁금함!!
    const startEvent = () => {
      element.addEventListener(eventType, callback);
    };

    const stopEvent = () => {
      element.removeEventListener(eventType, callback);
    };

    this.startObservers.push(startEvent);
    this.stopObservers.push(stopEvent);
  }

  unsubscribe(eventObject: SubscribeObject): void {
    const { element, eventName, callback } = eventObject;

    const eventType = eventName === "touchmove" ? "touchmove" : "touchend";

    const startEvent = () => {
      element.addEventListener(eventType, callback);
    };

    const stopEvent = () => {
      element.removeEventListener(eventType, callback);
    };

    this.startObservers = this.startObservers.filter((el) => el !== startEvent);
    this.stopObservers = this.stopObservers.filter((el) => el !== stopEvent);
  }

  start() {
    this.startObservers.forEach((observer) => observer());
  }
  stop() {
    this.stopObservers.forEach((observer) => observer());
  }
}
