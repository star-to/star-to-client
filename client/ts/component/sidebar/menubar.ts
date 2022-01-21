import { Component } from "../component";
import { SELECTOR, ACTION } from "../../const";
import Action from "../state/action";

export default class MenuBar implements Component {
  html: string;
  action: Action;
  constructor(action: Action) {
    this.action = action;

    this.html = /*html*/ `
    <div class="${SELECTOR.MENUBAR_WRAPPER}">
      <div class="${SELECTOR.MENUBAR_OVERLAY}">
      </div>
      <div class="${SELECTOR.MENUBAR_CONTENTS}">
      </div>
    </div>
    `;
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
    this.action.createObservers(ACTION.MENUBAR_TOGGLE);

    const onVisible = () => {
      this.displayMenubar();
    };
    this.action.subscribe(ACTION.MENUBAR_TOGGLE, onVisible);
  }

  displayMenubar(): void {
    const overlay = document.querySelector(
      `.${SELECTOR.MENUBAR_OVERLAY}`
    ) as HTMLDivElement;
    const sidebarWrapper = document.querySelector(
      `.${SELECTOR.MENUBAR}`
    ) as HTMLDivElement;

    sidebarWrapper.style.transform = "translate3d(100%,0,0)";
    overlay.style.width = "200%";
    overlay.style.backgroundColor = "rgba(51, 51, 51, 0.7)";
  }
}
