import { Component } from "../component";
import Action from "../state/action";
import { SELECTOR } from "../../const";
import MyMap from "./my-map";

export default class Review implements Component {
  action: Action;
  myMap: MyMap;

  constructor(action: Action, myMap: MyMap) {
    this.action = action;
    this.myMap = myMap;
  }

  paint(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
    <div class="${SELECTOR.REVIEW_WRAPPER}">
    HELLO, REVIEW
    </div>
    `;
  }
}
