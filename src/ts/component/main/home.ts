import { Component } from "../component";
import MyMap from "./my-map";
import { SeletedPlaceInfo } from "./my-map";
import { SELECTOR, IMG, PATH, ACTION, STATIC } from "../../const";
import Action from "../state/action";
import UserInfo from "../state/user-info";
import ReviewInfo from "../state/review-info";
import api from "../../api";

export default class Home implements Component {
  action: Action;
  myMap: MyMap;
  userInfo: UserInfo;
  reviewInfo: ReviewInfo;
  bagicHeight: number;
  viewHeight: number;
  recommendLayout: HTMLDivElement | null;
  home: HTMLDivElement | null;
  selectPlaceInfo: SeletedPlaceInfo | null;

  constructor(
    action: Action,
    myMap: MyMap,
    userInfo: UserInfo,
    reviewInfo: ReviewInfo
  ) {
    this.action = action;
    this.bagicHeight = 0;
    this.viewHeight = 0;
    this.recommendLayout = null;
    this.home = null;
    this.myMap = myMap;
    this.userInfo = userInfo;
    this.reviewInfo = reviewInfo;
    this.selectPlaceInfo = null;
  }

  paint(): void {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
    <div class="${SELECTOR.HOME_WRAPPER}">
      <div class="${SELECTOR.HOME_MAP_WRAPPER}">
      </div>
      <div class="${SELECTOR.MENUBAR_TOGGLE_BUTTON}">
        <img src="${IMG.PLUS}" alt="plus button">
      </div>
      <div class="${SELECTOR.SEARCH_WRAPPER}">
        <input class="${SELECTOR.SEARCH_KEYWORD}" type="text">
        <button class="${SELECTOR.SEARCH_INPUT_BUTTON}">
          <img src="${IMG.SEARCH}" alt="search button">
        </button>
      </div>
      <div class="${SELECTOR.MAP_MY_DIRECTION_BUTTON}">
        <img src="${IMG.MY_LOCATION}" alt="current location button">
      </div>
      <div class="${SELECTOR.HOME_RECOMMEND_WRAPPER}">
        <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON}">
          <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON_ICON}">
          </div>
        </div>
        <div class="${SELECTOR.PLACE_WRAPPER}">
          <div class="${SELECTOR.SIMPLE_PLACE_INFO}">
            장소를 클릭 해주세요.
          </div>
        </div>
      </div>
    </div>`;
  }

  init(): void {
    this.action.subscribe(
      ACTION.SELECT_PLACE_MARKER,
      (placeInfo: SeletedPlaceInfo) => {
        this.initSelectedPlace(placeInfo);
      }
    );
    this.recommendLayout = document.querySelector(
      `.${SELECTOR.HOME_RECOMMEND_WRAPPER}`
    ) as HTMLDivElement;

    this.home = document.querySelector(
      `.${SELECTOR.HOME_WRAPPER}`
    ) as HTMLDivElement;

    const mapLayout = document.querySelector(
      `.${SELECTOR.HOME_MAP_WRAPPER}`
    ) as Node;

    this.myMap.createMap(mapLayout);

    const layoutMoveButton = document.querySelector(
      `.${SELECTOR.RECOMMEND_MOVE_BUTTON}`
    ) as HTMLDivElement;

    const homeRect = this.home.getBoundingClientRect();
    this.viewHeight = homeRect.bottom;

    const recommendRect = this.recommendLayout.getBoundingClientRect();
    this.bagicHeight = recommendRect.top;

    const handleTouchStart = () => {
      const handleTouchMove = (event: TouchEvent) => {
        this.moveReccommendLayer(event);
      };

      const handleTouchEnd = (event: TouchEvent) => {
        if (!this.recommendLayout) return;
        this.home?.removeEventListener("touchmove", handleTouchMove);
        this.home?.removeEventListener("touchend", handleTouchEnd);

        const recommendRect = this.recommendLayout.getBoundingClientRect();
        const recommendPositionY = recommendRect.top;
        this.repositionReccommendLayer(event, recommendPositionY);
      };

      this.home?.addEventListener("touchmove", handleTouchMove);
      this.home?.addEventListener("touchend", handleTouchEnd);
    };

    layoutMoveButton.addEventListener("touchstart", handleTouchStart);

    //TODO: menubar toggle button click event
    //분리 해야할지 생각해보기!

    const visibleMenubarButton = document.querySelector(
      `.${SELECTOR.MENUBAR_TOGGLE_BUTTON}`
    ) as HTMLButtonElement;

    const handleVisibleMenubar = (e: Event) => {
      e.preventDefault();
      this.action.notify(ACTION.MENUBAR_VISIBLE);
    };

    visibleMenubarButton.addEventListener("click", handleVisibleMenubar);

    const mylocationButton = document.querySelector(
      `.${SELECTOR.MAP_MY_DIRECTION_BUTTON}`
    ) as HTMLDivElement;

    const handleMyLocation = () => {
      this.myMap.moveCurrentPosition();
    };

    mylocationButton.addEventListener("click", handleMyLocation);

    const searchInputButton = document.querySelector(
      `.${SELECTOR.SEARCH_INPUT_BUTTON}`
    ) as HTMLButtonElement;

    const searchInput = document.querySelector(
      `.${SELECTOR.SEARCH_KEYWORD}`
    ) as HTMLInputElement;

    const handleKeywordSearch = (e: Event) => {
      //TODO: 정규삭 추가하기
      e.preventDefault();
      const keyword = searchInput.value;

      this.myMap.moveToSearchedPlace(keyword);
    };

    searchInputButton.addEventListener("click", handleKeywordSearch);
    searchInput.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      searchInputButton.click();
    });
  }

  moveReccommendLayer(e: TouchEvent) {
    if (this.recommendLayout === null) return;

    const moveY = this.bagicHeight - e.changedTouches[0].clientY;
    this.recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
  }

  repositionReccommendLayer(e: TouchEvent, recommendPositionY: number) {
    if (this.recommendLayout === null) return;
    const currentY = e.changedTouches[0].clientY;

    const isUp = recommendPositionY > currentY;
    const moveY = isUp ? this.bagicHeight : 0;

    const recommendListWrapper = document.querySelector(
      `.${SELECTOR.PLACE_WRAPPER}`
    ) as HTMLDivElement;

    recommendListWrapper.scrollTop = 0;
    recommendListWrapper.style.overflow = isUp ? "scroll" : "hidden";

    this.recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
  }

  initSelectedPlace(placeInfo: SeletedPlaceInfo) {
    const $simplePlaceInfo = document.querySelector(
      `.${SELECTOR.SIMPLE_PLACE_INFO}`
    ) as HTMLDivElement;

    this.setSelectPlaceInfo(placeInfo);
    const bookmarkList = this.userInfo.getBookmarkList();
    const isBookmark = bookmarkList.includes(placeInfo.id);
    let starContent = "";
    const roundStarAvg = Math.ceil(placeInfo.star_avg);

    for (let i = 1; i <= 5; i++) {
      starContent +=
        roundStarAvg >= i
          ? `<img src="${IMG.FILL_STAR}" alt="fill star">`
          : `<img src="${IMG.EMPTY_STAR}" alt="empty star">`;
    }

    const placeContent = /*html*/ `
      <div class="${SELECTOR.PLACE_CONTENT_WRAPPER}">
        <span class="${SELECTOR.CONTENT_BOOKMARK}">
          <img src="${
            isBookmark ? IMG.FILL_BOOKMARK : IMG.EMPTY_BOOKMARK
          }" data-toggle="${isBookmark}" alt="bookmark"> 
        </span>
        <h1 class="${SELECTOR.CONTENT_NAME}">${placeInfo.place_name}</h1>
        <span class="${SELECTOR.CONTENT_STAR}">
          ${starContent}
        </span>
        <span class="${SELECTOR.CONTENT_COMMENT}">
          (${placeInfo.review_count})
        </span>
        <div class="${SELECTOR.CONTENT_TIME}">
        ${Math.ceil(
          (placeInfo.distance as number) / 67
        )}분 이내에 도착할 수 있습니다.
        </div>
      </div>
      </div>
    `;

    $simplePlaceInfo.innerHTML = placeContent;

    const $bookmark = $simplePlaceInfo.querySelector(
      `.${SELECTOR.CONTENT_BOOKMARK}`
    ) as HTMLSpanElement;
    $bookmark.addEventListener("click", (e: Event) => {
      const $bookmarkImg = e.target as HTMLImageElement;
      const newToggleBookmark =
        $bookmarkImg.dataset.toggle === "true" ? false : true;

      $bookmarkImg.dataset.toggle = `${newToggleBookmark}`;
      $bookmarkImg.src = newToggleBookmark
        ? IMG.FILL_BOOKMARK
        : IMG.EMPTY_BOOKMARK;

      if (newToggleBookmark) {
        api.createUserBookmark(placeInfo.id);
        this.userInfo.addBookmark(placeInfo.id);
      } else {
        api.deleteUserbookmark(placeInfo.id);
        this.userInfo.deleteBookmark(placeInfo.id);
      }
    });
  }

  getSelectPlaceInfo() {
    return { ...this.selectPlaceInfo };
  }

  private setSelectPlaceInfo(newSelectPlaceInfo: SeletedPlaceInfo) {
    this.selectPlaceInfo = { ...newSelectPlaceInfo };
  }
}
