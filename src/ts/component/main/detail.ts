import Action from "../state/action";
import { Component } from "../component";
import { SELECTOR } from "../../const";

export default class Detail implements Component {
  action: Action;

  constructor(action: Action) {
    this.action = action;

    //TODO: 장소 정보 조회 api 호출
  }
  paint(): void {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기
    ``;
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    //TODO: TEST HTML
    mainWrapper.innerHTML = /*html*/ `
    <div class="detail-wrapper">
        Hello
    </div>
    `;
  }
}
