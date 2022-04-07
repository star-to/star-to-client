import { Component } from "../component";
import Action from "../state/action";
import { SELECTOR } from "../../const";

export default class Review implements Component {
  action: Action;

  constructor(action: Action) {
    this.action = action;
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
