import { Component } from "../component";
import { IMG, SELECTOR } from "../../const";
import util from "../../util";

export default class Login implements Component {
  private html: string;

  constructor() {
    this.html = /*html*/ `
    <div class="${SELECTOR.LOGIN_WRAPPER}">
      <div class="${SELECTOR.LOGIN_LOGO}">
        <img src="${IMG.LOGIN_LOGO}" alt="Login logo image">
      </div>
      <div class="${SELECTOR.LOGIN_BUTTON_WRAPPER}">
        <div class="${SELECTOR.LOGIN_BUTTON_NAVER}">
          <span class="${SELECTOR.LOGIN_BUTTON_CONTENT}">
            네이버 로그인
          </span>
        </div>
        <div class="${SELECTOR.LOGIN_BUTTON_KAKAO}">
          <span class="${SELECTOR.LOGIN_BUTTON_CONTENT}">
            카카오 로그인
          </span>
        </div>
      </div>
    </div>
    `;
  }

  paint(): void {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;
    mainWrapper.innerHTML = this.html;
  }

  init(): void {
    const naverButton = document.querySelector(
      `.${SELECTOR.LOGIN_BUTTON_NAVER}`
    ) as HTMLDivElement;
    const kakaoButton = document.querySelector(
      `.${SELECTOR.LOGIN_BUTTON_KAKAO}`
    ) as HTMLDivElement;

    naverButton.addEventListener("click", () => {
      this.handleNaverLogin();
    });

    kakaoButton.addEventListener("click", () => {
      this.handleKakaoLogin();
    });
  }

  handleNaverLogin(): void {
    util
      .fetchNaverLogin()
      .then((res) => res.text())
      .then((url) => {
        window.location.href = url;
      });
  }

  handleKakaoLogin(): void {
    util
      .fetchKakaoLogin()
      .then((res) => res.text())
      .then((url) => {
        window.location.href = url;
      });
  }
}
