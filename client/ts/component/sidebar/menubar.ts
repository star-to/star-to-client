import { Component } from "../component";
import SELECTOR from "../../const";

export default class MenuBar implements Component {
  html: string;
  constructor() {
    this.html = ``;
  }
  paintComponent(): void {
    const sidebarWrapper = document.querySelector(
      `${SELECTOR.SIDEBAR}`
    ) as HTMLElement;
    sidebarWrapper.innerHTML = this.html;
  }
}
