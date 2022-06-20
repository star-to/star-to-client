import { Component } from "../component";
import MyMap from "./my-map";
import { SeletedPlaceInfo } from "./my-map";
import { SELECTOR, IMG, PATH, ACTION, STATIC } from "../../const";
import Action from "../state/action";
import UserInfo from "../state/user-info";
import ReviewInfo from "../state/review-info";
import api from "../../api";

type MoveParameter = "up" | "down" | number;

interface DetailPlaceInfo {
  id: string;
  count: number | undefined;
  pair_id: number | undefined;
  content: string | undefined;
}

export default class Home implements Component {
  action: Action;
  myMap: MyMap;
  userInfo: UserInfo;
  reviewInfo: ReviewInfo;
  bagicHeight: number;
  viewHeight: number;
  $selectedPlaceInfo: HTMLDivElement | null;
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
    this.$selectedPlaceInfo = null;
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
      <div class="${SELECTOR.HOME_PLACE_INFO_WRAPPER}">
        <div class="${SELECTOR.PLACE_INFO_MOVE_BUTTON}">
          <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON_ICON}">
          </div>
        </div>
        <div class="${SELECTOR.PLACE_WRAPPER}">
          <div class="${SELECTOR.SIMPLE_PLACE_INFO}">
            <h1 style="font-size:0.8em;">장소를 클릭 해주세요.</h1>
          </div>
          <div class="${SELECTOR.TOGGLE_PLACE_INFO} ${SELECTOR.NONE}">
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
    this.$selectedPlaceInfo = document.querySelector(
      `.${SELECTOR.HOME_PLACE_INFO_WRAPPER}`
    ) as HTMLDivElement;

    this.home = document.querySelector(
      `.${SELECTOR.HOME_WRAPPER}`
    ) as HTMLDivElement;

    const mapLayout = document.querySelector(
      `.${SELECTOR.HOME_MAP_WRAPPER}`
    ) as Node;

    this.myMap.createMap(mapLayout);

    const layoutMoveButton = document.querySelector(
      `.${SELECTOR.PLACE_INFO_MOVE_BUTTON}`
    ) as HTMLDivElement;

    const homeRect = this.home.getBoundingClientRect();
    this.viewHeight = homeRect.bottom;

    const selectedRect = this.$selectedPlaceInfo.getBoundingClientRect();
    this.bagicHeight = selectedRect.top;

    const handleTouchStart = () => {
      const handleTouchEnd = (event: TouchEvent) => {
        if (!this.$selectedPlaceInfo) return;
        this.home?.removeEventListener("touchend", handleTouchEnd);

        const rect = this.$selectedPlaceInfo.getBoundingClientRect();
        const selectedPositionY = rect.top;
        this.repositionPlaceInfoLayer(event, selectedPositionY);
      };

      //TODO: touchmove 이벤트에 대해서도 구현 필요함!

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

  getSelectPlaceInfo() {
    return { ...this.selectPlaceInfo };
  }

  private initSelectedPlace(placeInfo: SeletedPlaceInfo) {
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
      e.stopPropagation();
      const $bookmarkImg = e.target as HTMLImageElement;

      this.toogleBookmark($bookmarkImg);
    });

    $simplePlaceInfo.addEventListener("click", (e: Event) => {
      this.changePlaceInfoLayer("up");
    });
  }

  private toogleBookmark($targetElement: HTMLImageElement) {
    const { id: placeId } = this.getSelectPlaceInfo();

    if (!placeId) return;

    const newToggleBookmark =
      $targetElement.dataset.toggle === "true" ? false : true;

    $targetElement.dataset.toggle = `${newToggleBookmark}`;
    $targetElement.src = newToggleBookmark
      ? IMG.FILL_BOOKMARK
      : IMG.EMPTY_BOOKMARK;

    //TODO: 이 기능 분리 해야할 지 고민해보기
    if (newToggleBookmark) {
      api.createUserBookmark(placeId);
      this.userInfo.addBookmark(placeId);
    } else {
      api.deleteUserbookmark(placeId);
      this.userInfo.deleteBookmark(placeId);
    }
  }

  private repositionPlaceInfoLayer(e: TouchEvent, currentPositionY: number) {
    if (this.$selectedPlaceInfo === null) return;
    const movePositionY = e.changedTouches[0].clientY;

    const upOrDown = currentPositionY > movePositionY ? "up" : "down";

    const $placeInfoWrapper = this.$selectedPlaceInfo.querySelector(
      `.${SELECTOR.PLACE_WRAPPER}`
    ) as HTMLDivElement;

    $placeInfoWrapper.scrollTop = 0;
    $placeInfoWrapper.style.overflow = upOrDown === "up" ? "scroll" : "hidden";

    this.changePlaceInfoLayer(upOrDown);
  }

  private modifyPlaceInfoStyle($target: HTMLElement, isUp: boolean) {
    isUp
      ? this.toggleClassName(
          $target,
          [SELECTOR.DETAIL_PLACE_INFO],
          [SELECTOR.SIMPLE_PLACE_INFO]
        )
      : this.toggleClassName(
          $target,
          [SELECTOR.SIMPLE_PLACE_INFO],
          [SELECTOR.DETAIL_PLACE_INFO]
        );
  }

  private toggleClassName(
    $target: HTMLElement,
    addList?: string[],
    removeList?: string[]
  ) {
    removeList?.forEach((name) => $target.classList.remove(name));
    addList?.forEach((name) => $target.classList.add(name));
  }

  private addPlaceInfoElement() {
    if (!this.selectPlaceInfo) return;

    const detailContents = this.reviewInfo.getDetailContents();
    const tmp: DetailPlaceInfo[] = [];
    const pairIdSet = new Set<number>();
    const detailReviewBoard = Object.keys(
      this.selectPlaceInfo.contentReviewCountList
    ).reduce((acc, key) => {
      const contentObject = detailContents.find(
        (content) => content.detail_content_id === Number(key)
      );
      if (!contentObject) return acc;
      if (contentObject.pair_id !== null) pairIdSet.add(contentObject.pair_id);

      const newObject = {
        id: key,
        count: this.selectPlaceInfo?.contentReviewCountList[key],
        pair_id: contentObject.pair_id,
        content: contentObject.content,
      };

      acc.push(newObject);

      return acc;
    }, tmp);

    const existDetailReview = detailReviewBoard.every(
      (info) => info.count !== 0
    );

    const pairIdList = Array.from(pairIdSet);

    let pairReview = "";

    if (!existDetailReview) {
      pairReview = pairIdList.reduce((acc, pairId) => {
        const pairContents = detailReviewBoard.filter(
          (e) => e.pair_id === pairId
        );

        if (pairContents.length === 0) return acc;

        const positiveCount = pairContents[0].count ?? 0;
        const nagativeCount = pairContents[1].count ?? 0;

        if (positiveCount === 0 && nagativeCount === 0) return acc;

        const positiveRatio = Math.ceil(
          (positiveCount / (positiveCount + nagativeCount)) * 100
        );

        acc += /*html*/ `
          <li class="${SELECTOR.PAIR_REVIEW}" id=${pairId}>
            <div class="${SELECTOR.PAIR_CONTENT}">
              <div class="${SELECTOR.POSITIVE_CONTENT}">
                <span class="${SELECTOR.TITLE}">${pairContents[0].content}</span>
                <span class="${SELECTOR.COUNT}">${pairContents[0].count}</span>
              </div>
              <div class="${SELECTOR.NAGATIVE_CONTENT}">
                <span class="${SELECTOR.COUNT}">${pairContents[1].count}</span>
                <span class="${SELECTOR.TITLE}">${pairContents[1].content}</span>
              </div>
            </div>
            <div class="${SELECTOR.RATIO_BAR}">
              <div class="${SELECTOR.POSITIVE_RATIO}" style="width:${positiveRatio}%"></div>
              <div class="${SELECTOR.NAGATIVE_RATIO}"></div>
            </div>
          </li>
        `;
        return acc;
      }, "");
    }

    const pairReviewHTML =
      pairReview === ""
        ? pairReview
        : /*html*/ `
      <ul class="${SELECTOR.CONTENT_REVIEW_LIST}">
        ${pairReview}
      </ul>
    `;

    const nullContents = detailReviewBoard.filter(
      (e) => e.pair_id === null && e.count !== 0
    );

    const nullReview =
      nullContents.length === 0
        ? ""
        : nullContents.reduce((acc, cur) => {
            acc += /*html */ `
          <li class="${SELECTOR.NULL_CONTENT}" id=${cur.id}>
            <span class="${SELECTOR.TITLE}">${cur.content}</span>
            <span class="${SELECTOR.COUNT}">${cur.count}</span>
          </li>
        `;
            return acc;
          }, ``);

    const nullReviewHtml =
      nullReview === ""
        ? nullReview
        : /*html*/ `
    <ul class="${SELECTOR.NULL_REVIEW_LIST}">
    ${nullReview}
    </ul>
    `;

    const hmtl = /*html*/ `
      <div class="${SELECTOR.DETAIL_CONTENT}">
        <div class="${SELECTOR.CONTENT_ADDRESS}">
          <span class="${SELECTOR.CONTENT_ADDRESS_NAME}">
          ${this.selectPlaceInfo?.road_address_name}
          </span>
          <span class="${SELECTOR.CONTENT_ADDRESS_COPY}">
            복사
          </span>
        </div>
        <div class="${SELECTOR.CONTENT_LINE}">
        </div>
        <div class="${SELECTOR.CONTENT_REVIEW_WRAPPER}">
          ${pairReviewHTML}
          ${
            pairReview === "" && nullReview === ""
              ? "등록된 상세리뷰가 없습니다."
              : ""
          }
          ${nullReviewHtml}
        </div>
      </div>
    `;
    const $detailContentWrapper = this.$selectedPlaceInfo?.querySelector(
      `.${SELECTOR.DETAIL_CONTENT_WRAPPER}`
    ) as HTMLDivElement;

    $detailContentWrapper.innerHTML = hmtl;
  }

  private changePlaceInfoLayer(move: MoveParameter) {
    if (this.$selectedPlaceInfo === null) return;
    const $detailContentWrapper = this.$selectedPlaceInfo?.querySelector(
      `.${SELECTOR.TOGGLE_PLACE_INFO}`
    ) as HTMLDivElement;

    if (move === "up" || move === "down") {
      const $placeInfo = this.$selectedPlaceInfo.querySelector(
        `.${SELECTOR.PLACE_WRAPPER} div`
      ) as HTMLElement;
      this.modifyPlaceInfoStyle($placeInfo, move === "up");

      //TODO:  이 부분 깔끔하게 변경할 수 있을 것 같은데 고민해보기
      if (move === "up") {
        this.toggleClassName(
          $detailContentWrapper,
          [SELECTOR.DETAIL_CONTENT_WRAPPER],
          [SELECTOR.NONE]
        );
        this.addPlaceInfoElement();
      } else {
        this.toggleClassName(
          $detailContentWrapper,
          [SELECTOR.NONE],
          [SELECTOR.DETAIL_CONTENT_WRAPPER]
        );
      }
    }

    const moveY = move === "up" ? this.bagicHeight : 0;
    this.$selectedPlaceInfo.style.transform = `translate3d(0,-${moveY}px,0)`;
  }

  private setSelectPlaceInfo(newSelectPlaceInfo: SeletedPlaceInfo) {
    this.selectPlaceInfo = { ...newSelectPlaceInfo };
  }
}
