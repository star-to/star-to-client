import { Component } from "../component";

export default class Loading implements Component {
  html: string;
  constructor() {
    this.html = `<div class="loading-wrapper">
    <img src="https://star-to.s3.ap-northeast-2.amazonaws.com/img/loading.png" alt="Loading image">
    </div>
    `;
  }
  getHtml(): string {
    return this.html;
  }
}
