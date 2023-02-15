import { Component } from "../component";
import { SELECTOR, ACTION, PATH } from "../../const";
import Action from "../state/action";
import api from "../../api";

export default class MenuBar implements Component {
  html: string;
  action: Action;
  overlayLayout: HTMLDivElement | null;
  contentsLayout: HTMLElement | null;
  constructor(action: Action) {
    this.action = action;

    this.html = /*html*/ `
    <div class="${SELECTOR.MENUBAR_WRAPPER}">
      <div class="${SELECTOR.MENUBAR_OVERLAY}">
      </div>
      <div class="${SELECTOR.MENUBAR_CONTENTS_WRAPPER}">
        <div class="${SELECTOR.MENUBAR_CONTENTS}">
          <a class="${SELECTOR.MENUBAR_CONTENTS_MY_REVIEW}" href="${PATH.MY_REVIEW}">
            MY리뷰
          </a>
          <a class="${SELECTOR.MENUBAR_CONTENTS_BOOKMARK}" href="${PATH.BOOKMARK}">
            즐겨찾기
          </a>
          <a class="${SELECTOR.MENUBAR_CONTENTS_LOGOUT}" >
            로그아웃
          </a>
        </div>
      </div>
    </div>
    `;

    this.contentsLayout = null;
    this.overlayLayout = null;
  }

  paint(): void {
    const sidebarWrapper = document.querySelector(
      `${SELECTOR.SIDEBAR}`
    ) as HTMLElement;

    sidebarWrapper.className = "";
    sidebarWrapper.classList.add(SELECTOR.MENUBAR);
    sidebarWrapper.innerHTML = this.html;
  }

  init(): void {
    this.overlayLayout = document.querySelector(
      `.${SELECTOR.MENUBAR_OVERLAY}`
    ) as HTMLDivElement;

    this.contentsLayout = document.querySelector(
      `.${SELECTOR.MENUBAR_CONTENTS_WRAPPER}`
    ) as HTMLElement;

    this.action.createObservers(ACTION.MENUBAR_VISIBLE);

    const onVisible = () => {
      this.display();
    };
    this.action.subscribe(ACTION.MENUBAR_VISIBLE, onVisible);

    this.overlayLayout.addEventListener("click", () => {
      this.hide();
    });

    const logoutButton = this.contentsLayout.querySelector(
      `.${SELECTOR.MENUBAR_CONTENTS_LOGOUT}`
    ) as HTMLAnchorElement;

    logoutButton.addEventListener("click", (event: Event) => {
      event.preventDefault();

      const isLogout = confirm("로그아웃 하시겠습니까?");

      if (isLogout) {
        api
          .fetchLogout()
          .then((res) => res.text())
          .then((url) => {
            window.location.href = url;
          });
      }
    });
  }

  display(): void {
    if (this.overlayLayout === null || this.contentsLayout === null) return;

    this.contentsLayout.style.transform = "translate3d(160%,0,0)";
    this.overlayLayout.style.display = "block";
    this.overlayLayout.style.backgroundColor = "rgba(51, 51, 51, 0.8)";
  }

  hide(): void {
    if (this.overlayLayout === null || this.contentsLayout === null) return;

    this.overlayLayout.style.backgroundColor = "rgba(51, 51, 51, 0)";
    this.contentsLayout.style.transform = "translate3d(-160%,0,0)";
    this.overlayLayout.style.display = "none";
  }
}
