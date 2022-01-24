import { Component } from "../component";
import Action from "../state/action";
// import { Params } from "../../routes";
import { SELECTOR } from "../../const";
import { ObserverFunction, State } from "../observable";

export default class MyReview implements Component {
  action: Action;

  constructor(action: Action) {
    this.action = action;
  }

  paint(): void {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기

    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
      <div class="my-review-wrapper">
      </div>
      `;
  }

  init(): void {
    this.action.subscribe(
      "updateUserInfo",
      this.fillReveiw as ObserverFunction
    );

    this.action.notify("fetchClientReview");
  }

  fillReveiw(reviewList: State[]): void {
    // eslint-disable-next-line no-console
    reviewList.forEach((review) => console.log(review));
  }
}
