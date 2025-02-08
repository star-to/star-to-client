import { IMG, SELECTOR } from "@/ts/const";

import Action from "@component/state/action";
import { Component } from "@component/component";

export default class Loading implements Component {
  private html: string;
  action: Action;

  constructor(action: Action) {
    this.html = /*html*/ `
    <div class="${SELECTOR.LOADING_WRAPPER}">
      <img src="${IMG.LOGO}" alt="Loading image">
    </div>
    `;

    this.action = action;
  }

  paint(): void {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = this.html;
  }
}
