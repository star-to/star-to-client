import { Component } from "../component";
import SELECTOR from "../../const";

export default class Home implements Component {
  html: string;
  constructor() {
    this.html = `<div class="${SELECTOR.HOME_WRAPPER}">
    <div class="${SELECTOR.HOME_MAP_WRAPPER}">
    </div>
    <div class="${SELECTOR.HOME_RECOMMEND_WRAPPER}">
    <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON}">
    </div>
    <ul>
    </ul>
    </div>
    </div>`;
  }
  paintComponent(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;
    mainWrapper.innerHTML = this.html;
  }

  subscribeEvent(): void {
    const recommendLayout = document.querySelector(
      `.${SELECTOR.HOME_RECOMMEND_WRAPPER}`
    ) as HTMLDivElement;

    const layoutMoveButton = document.querySelector(
      `.${SELECTOR.RECOMMEND_MOVE_BUTTON}`
    ) as HTMLDivElement;

    // eslint-disable-next-line no-console
    layoutMoveButton.addEventListener("pointerdown", (e) => {
      document.querySelector(`.${SELECTOR.OVERLAY}`)?.classList.remove("none");
    });

    layoutMoveButton.addEventListener("pointermove", (e) => {
      //TODO: 위치 변화가 정확하지 않음!! 수정필요함
      //TODO: 원래 위치로 돌아갔을 때 overlay 숨기기
      recommendLayout.style.transform = `translate3d(0,-${e.clientY}px,0)`;
    });
  }
}
