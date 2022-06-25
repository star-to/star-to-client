import { Component } from "../component";
import Action from "../state/action";
import UserInfo, { BookmarkPlaceInfo } from "../state/user-info";
import { IMG, SELECTOR } from "../../const";
import util from "../util";

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
        <div class="${SELECTOR.BOOKMARK_WRAPPER}"></div>
    `;

    this.$bookmarkWrapper = document.querySelector(
      `.${SELECTOR.BOOKMARK_WRAPPER}`
    ) as HTMLDivElement;
  }

  private fillPlaceInfo(): void {
    if (!this.$bookmarkWrapper) return;

    const bookmarkBoard: BookmarkPlaceInfo[] = this.userInfo.getBookmarkList();
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
                ${util.paintStar(roundStarAvg)}
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

    if ($bookmarkButtonList.length === 0) return;

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
