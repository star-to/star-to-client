import { Component } from "../component";
import Action from "../state/action";
import { SELECTOR } from "../../const";
import MyMap from "./my-map";
import { Params } from "src/ts/routes";

export default class Review implements Component {
  action: Action;
  myMap: MyMap;
  //TODO: 자료형 만들어야할 듯
  params: Params;

  constructor(action: Action, myMap: MyMap, params: Params) {
    this.action = action;
    this.myMap = myMap;
    this.params = params;
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
