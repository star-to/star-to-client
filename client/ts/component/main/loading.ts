import { Component } from "../component";

export default class Loading implements Component {
  html: string;
  constructor() {
    this.html = `<div class="loading-wrapper">
    <img src="/client/img/icon/loading-icon.png" alt="Loading image">
    </div>
    `;
  }
  getHtml(): string {
    return this.html;
  }
}
