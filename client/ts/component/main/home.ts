import { Component } from "../component";
import SELECTOR from "../../const";

export default class Home implements Component {
  html: string;
  bagicHeight: number;
  viewHeight: number;
  recommendLayout: HTMLDivElement | null;
  home: HTMLDivElement | null;
  constructor() {
    this.html = /*html*/ `
    <div class="${SELECTOR.HOME_WRAPPER}">
      <div class="${SELECTOR.HOME_MAP_WRAPPER}">
      </div>
      <div class="${SELECTOR.HOME_RECOMMEND_WRAPPER}">
        <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON}">
          <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON_ICON}">
          </div>
        </div>
        <ul class="${SELECTOR.RECOMMEND_LIST}">
        </ul>
      </div>
    </div>`;

    this.bagicHeight = 0;
    this.viewHeight = 0;
    this.recommendLayout = null;
    this.home = null;
  }

  paintComponent(): void {
    //TODO: 함수명 init으로 변경할 지? 고민
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;
    mainWrapper.innerHTML = this.html;
  }

  subscribeEvent(): void {
    this.recommendLayout = document.querySelector(
      `.${SELECTOR.HOME_RECOMMEND_WRAPPER}`
    ) as HTMLDivElement;

    this.home = document.querySelector(
      `.${SELECTOR.HOME_WRAPPER}`
    ) as HTMLDivElement;

    const layoutMoveButton = document.querySelector(
      `.${SELECTOR.RECOMMEND_MOVE_BUTTON}`
    ) as HTMLDivElement;

    const homeRect = this.home.getBoundingClientRect();
    this.viewHeight = homeRect.bottom;

    const recommendRect = this.recommendLayout.getBoundingClientRect();
    this.bagicHeight = recommendRect.top;

    const handleTouchStart = () => {
      const handleTouchMove = (event: TouchEvent) => {
        this.moveReccommendLayer(event);
      };

      const handleTouchEnd = (event: TouchEvent) => {
        this.home?.removeEventListener("touchmove", handleTouchMove);
        this.home?.removeEventListener("touchend", handleTouchEnd);
        this.repositionReccommendLayer(event);
      };

      this.home?.addEventListener("touchmove", handleTouchMove);
      this.home?.addEventListener("touchend", handleTouchEnd);
    };

    layoutMoveButton.addEventListener("touchstart", handleTouchStart);
  }

  moveReccommendLayer(e: TouchEvent) {
    if (this.recommendLayout === null) return;

    const moveY = this.bagicHeight - e.changedTouches[0].clientY;
    this.recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
  }

  repositionReccommendLayer(e: TouchEvent) {
    //TODO: viewport 중간이상이면 화면 제일 위로, 아니면 초기위치로 위치 조정 하고싶음
    if (this.recommendLayout === null) return;

    const moveY = this.bagicHeight - e.changedTouches[0].clientY;
    this.recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
  }
}
