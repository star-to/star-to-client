import SELECTOR from "../../const";
import { Component } from "../component";

export default class Loading implements Component {
  html: string;
  constructor() {
    this.html = `<div class="loading-wrapper">
    <img src="https://star-to.s3.ap-northeast-2.amazonaws.com/img/loading.png" alt="Loading image">
    </div>
    `;
  }
  paintComponent(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    // eslint-disable-next-line no-console
    console.log(mainWrapper);
    mainWrapper.innerHTML = this.html;
  }
}
