import { Component } from "../component";
import Action from "../state/action";
import UserInfo, { BookmarkPlaceInfo } from "../state/user-info";
import { IMG, SELECTOR } from "../../const";
import util from "../util";

export default class Bookmark implements Component {
  action: Action;
  userInfo: UserInfo;

  constructor(action: Action, userInfo: UserInfo) {
    this.action = action;
    this.userInfo = userInfo;
  }

  init(): void {
    this.fillPlaceInfo();
  }

  paint(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
        <div class="${SELECTOR.BOOKMARK_WRAPPER}"></div>
    `;
  }

  fillPlaceInfo(): void {
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
            <span class="${SELECTOR.BOOKMARK_CONTENT_IMG}">
                <img src="${IMG.FILL_BOOKMARK}" >
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

    const $bookmarkWrapper = document.querySelector(
      `.${SELECTOR.BOOKMARK_WRAPPER}`
    ) as HTMLDivElement;

    $bookmarkWrapper.innerHTML = html;
  }
}
