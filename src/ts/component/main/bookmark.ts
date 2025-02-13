import { IMG, SELECTOR } from "@/ts/const";
import UserInfo, { BookmarkPlaceInfo } from "@component/state/user-info";

import Action from "@component/state/action";
import { Component } from "@component/component";
import { paintStar } from "@component/util";

export default class Bookmark implements Component {
  action: Action;
  userInfo: UserInfo;
  $bookmarkWrapper: HTMLDivElement | null;

  constructor(action: Action, userInfo: UserInfo) {
    this.action = action;
    this.userInfo = userInfo;
    this.$bookmarkWrapper = null;
  }

  init(): void {
    this.fillPlaceInfo();
    this.addEventListener();
  }

  paint(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
        <div class="${SELECTOR.BOOKMARK_WRAPPER}">
            <h2 style="font-size:0.8em; font-weight:600;">추가한 즐겨찾기 목록이 없습니다.<h2>
        </div>
    `;

    this.$bookmarkWrapper = document.querySelector(
      `.${SELECTOR.BOOKMARK_WRAPPER}`
    ) as HTMLDivElement;
  }

  private fillPlaceInfo(): void {
    if (!this.$bookmarkWrapper) return;

    const bookmarkBoard: BookmarkPlaceInfo[] = this.userInfo.getBookmarkList();

    if (bookmarkBoard.length === 0) return;

    const bookmarkString = bookmarkBoard.reduce((acc, placeInfo) => {
      const {
        place_id: placId,
        place_name: placeName,
        star_average: star,
      } = placeInfo;

      const roundStarAvg = Math.ceil(star);

      acc += /*html*/ `
    <li class="${SELECTOR.BOOKMARK_CONTENT}" id="${placId}">
        <div class="${SELECTOR.BOOKMARK_CONTENT_WRAPPER}">
            <span class="${SELECTOR.BOOKMARK_CONTENT_IMG}" id="${placId}">
                <img src="${IMG.FILL_BOOKMARK}" data-toggle="true" >
            </span>
            <span class="${SELECTOR.BOOKMARK_CONTENT_NAME}">
                ${placeName}
            </span>
            <span>
                ${paintStar(roundStarAvg)}
            </span>
        </div>
    </li>  
    `;

      return acc;
    }, "");

    const html = /*html*/ `
    <div class="${SELECTOR.BOOKMARK_LIST_WRAPPER}">
        <ul class="${SELECTOR.BOOKMARK_LIST}">
            ${bookmarkString}
        </ul>
    </div>
    `;

    this.$bookmarkWrapper.innerHTML = html;
  }

  private addEventListener(): void {
    if (!this.$bookmarkWrapper) return;

    const $bookmarkButtonList =
      this.$bookmarkWrapper.querySelectorAll(
        `.${SELECTOR.BOOKMARK_CONTENT_IMG}`
      ) || [];

    if ($bookmarkButtonList.length === 0) {
      this.$bookmarkWrapper.style.justifyContent = "center";
      return;
    }

    $bookmarkButtonList.forEach(($bookmarkButton) => {
      $bookmarkButton.addEventListener("click", (e: Event) => {
        const $target = e.target as HTMLElement;
        const $imgTarget = $target.closest("img") as HTMLImageElement;
        const id = $bookmarkButton.id;

        const placeInfo = this.userInfo
          .getBookmarkList()
          .find((e) => e.place_id === id);

        if (!placeInfo) {
          //TODO: 에러처리
          return;
        }

        this.userInfo.toggleBookmark($imgTarget, placeInfo);
      });
    });
  }
}
