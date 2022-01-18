import SELECTOR from "../../const";
import { Component } from "../component";

export default class Loading implements Component {
  private html: string;
  constructor() {
    this.html = /*html*/ `
    <div class="loading-wrapper">
      <img src="https://star-to.s3.ap-northeast-2.amazonaws.com/img/loading.png" alt="Loading image">
    </div>
    `;
  }
  paintComponent(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = this.html;
  }
}
