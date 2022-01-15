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
    <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON_ICON}">
    </div>
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
    const layoutMoveButton = document.querySelector(
      `.${SELECTOR.RECOMMEND_MOVE_BUTTON}`
    ) as HTMLDivElement;

    layoutMoveButton.addEventListener("touchstart", () => {
      this.handleLayoutMoveEvent();
    });
  }

  handleLayoutMoveEvent(): void {
    //TODO: 한번 이동한 후에 다시 버튼을 클릭해야 이벤트가 발생하도록 수정해야함
    const home = document.querySelector(
      `.${SELECTOR.HOME_WRAPPER}`
    ) as HTMLDivElement;

    const layoutMoveButton = document.querySelector(
      `.${SELECTOR.RECOMMEND_MOVE_BUTTON}`
    ) as HTMLDivElement;

    const recommendLayout = document.querySelector(
      `.${SELECTOR.HOME_RECOMMEND_WRAPPER}`
    ) as HTMLDivElement;

    const domRect = recommendLayout.getBoundingClientRect();
    const basicHeight = domRect.top;
    const middleHeight = domRect.bottom;
    //TODO: 중간위치가 정확하지 않음

    home.addEventListener("touchmove", (e) => {
      const moveY = basicHeight - e.changedTouches[0].clientY;

      recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
    });

    home.addEventListener("touchend", (e) => {
      const moveY =
        middleHeight > e.changedTouches[0].clientY
          ? e.changedTouches[0].clientY - basicHeight
          : e.changedTouches[0].clientY;

      recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
    });
  }
}
