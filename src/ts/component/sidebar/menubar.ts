import { Component } from "../component";
import { SELECTOR, ACTION, PATH } from "../../const";
import Action from "../state/action";

export default class MenuBar implements Component {
  html: string;
  action: Action;
  overlayLayout: HTMLDivElement | null;
  contentsLayout: HTMLElement | null;
  constructor(action: Action) {
    this.action = action;

    this.html = /*html*/ `
    <div class="${SELECTOR.MENUBAR_WRAPPER}">
      <div class="${SELECTOR.MENUBAR_OVERLAY}">
      </div>
      <div class="${SELECTOR.MENUBAR_CONTENTS_WRAPPER}">
        <div class="${SELECTOR.MENUBAR_CONTENTS}">
          <span class="${SELECTOR.MENUBAR_CONTENTS_MY_REVIEW}" data-link="${PATH.MY_REVIEW}">
            MY리뷰
          </span>
          <span class="${SELECTOR.MENUBAR_CONTENTS_BOOKMARK}" data-link="${PATH.BOOKMARK}">
            즐겨찾기
          </span>
        </div>
      </div>
    </div>
    `;

    this.contentsLayout = null;
    this.overlayLayout = null;
  }

  paint(): void {
    const sidebarWrapper = document.querySelector(
      `${SELECTOR.SIDEBAR}`
    ) as HTMLElement;

    sidebarWrapper.className = "";
    sidebarWrapper.classList.add(SELECTOR.MENUBAR);
    sidebarWrapper.innerHTML = this.html;
  }

  init(): void {
    this.overlayLayout = document.querySelector(
      `.${SELECTOR.MENUBAR_OVERLAY}`
    ) as HTMLDivElement;

    this.contentsLayout = document.querySelector(
      `.${SELECTOR.MENUBAR_CONTENTS_WRAPPER}`
    ) as HTMLElement;

    this.action.createObservers(ACTION.MENUBAR_VISIBLE);

    const onVisible = () => {
      this.displayMenubar();
    };
    this.action.subscribe(ACTION.MENUBAR_VISIBLE, onVisible);

    this.overlayLayout.addEventListener("click", () => {
      this.hideMenubar();
    });
  }

  displayMenubar(): void {
    if (this.overlayLayout === null || this.contentsLayout === null) return;

    this.contentsLayout.style.transform = "translate3d(160%,0,0)";
    this.overlayLayout.style.display = "block";
    this.overlayLayout.style.backgroundColor = "rgba(51, 51, 51, 0.8)";
  }

  hideMenubar(): void {
    if (this.overlayLayout === null || this.contentsLayout === null) return;

    this.overlayLayout.style.backgroundColor = "rgba(51, 51, 51, 0)";
    this.contentsLayout.style.transform = "translate3d(-160%,0,0)";
    this.overlayLayout.style.display = "none";
  }
}
