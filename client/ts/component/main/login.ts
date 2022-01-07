import { Component } from "../component";
import SELECTOR from "../../const";
import util from "../../util";

export default class Login implements Component {
  html: string;
  constructor() {
    this.html = `<div class="login-wrapper">
        <div class="login-logo">
            <img src="https://star-to.s3.ap-northeast-2.amazonaws.com/img/login.png" alt="Login logo image">
        </div>
        <div class="login-button-wrapper">
            <div class="login-button__naver">
                <span class="button-text">
                    네이버 로그인
                </span>
            </div>
            <div class="login-button__kakao">
                <span class="button-text">
                    카카오 로그인
                </span>
            </div>
        </div>
    </div>
    `;
  }
  getHtml(): string {
    return this.html;
  }

  subscribeEvent(): void {
    const naverButton = document.querySelector(
      `.${SELECTOR.LOGIN_BUTTON_NAVER}`
    ) as HTMLDivElement;

    naverButton.addEventListener("click", () => {
      this.handleNaverLogin();
    });
  }

  handleNaverLogin(): void {
    util
      .fetchNaverLogin()
      .then((res) => res.text())
      .then((url) => {
        // eslint-disable-next-line no-console
        // console.log(JSON.stringify(html));
        window.location.href = url;
      });
  }
}
