import { Component } from "../component";
import { SELECTOR } from "../../const";

export default class MenuBar implements Component {
  html: string;
  constructor() {
    this.html = /*html*/ `
    <div class="${SELECTOR.MENUBAR_WRAPPER}">
      <div class="${SELECTOR.MENUBAR_CONTENTS}">
      </div>
      <div class="${SELECTOR.MENUBAR_OVERLAY} ${SELECTOR.NONE}">
      </div>
    </div>
    
    `;
  }
  paintComponent(): void {
    const sidebarWrapper = document.querySelector(
      `${SELECTOR.SIDEBAR}`
    ) as HTMLElement;
    sidebarWrapper.className = "";
    sidebarWrapper.classList.add("menubar");
    sidebarWrapper.innerHTML = this.html;
  }

  displayMenubar(): void {
    const overlay = document.querySelector(
      `.${SELECTOR.MENUBAR_OVERLAY}`
    ) as HTMLDivElement;
    const sidebarWrapper = document.querySelector(
      `.${SELECTOR.MENUBAR_WRAPPER}`
    ) as HTMLDivElement;

    overlay.classList.remove(SELECTOR.NONE);
    sidebarWrapper.style.transform = "translate3d(65%,0,0)";
  }
}
