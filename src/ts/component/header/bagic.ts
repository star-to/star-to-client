import { IMG, SELECTOR } from "../../const";
import { Component } from "../component";

export default class Bagic implements Component {
  html: string;

  constructor() {
    this.html = /*html*/ `
    <div class="${SELECTOR.BAGIC_WRAPPER}">
        <a href="/" class="${SELECTOR.BAGIC_HOME_BUTTON}">
            <img src="${IMG.HOME_LOGO}" alt="logo home button">
        </a>
    </div>
    `;
  }

  paint = (): void => {
    const header = document.querySelector(`${SELECTOR.HEADER}`) as HTMLElement;
    header.innerHTML = this.html;
    header.className = "";
    header.classList.add(`${SELECTOR.BAGIC}`);
  };
}
