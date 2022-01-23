import { SELECTOR } from "../../const";
import { Component } from "../component";

export default class Bagic implements Component {
  html: string;

  constructor() {
    this.html = /*html*/ `
    <div class="${SELECTOR.BAGIC_WRAPPER}">
    </div>
    `;
  }

  paint(): void {
    const header = document.querySelector(`${SELECTOR.HEADER}`) as HTMLElement;
    header.innerHTML = this.html;
    header.className = "";
    header.classList.add(`${SELECTOR.BAGIC}`);
  }
}
