import { ACTION, IMG, SELECTOR } from "@/ts/const";
import MyMap, { SeletedPlaceInfo } from "@component/main/my-map";

import Action from "@component/state/action";
import { Component } from "@component/component";
import ReviewInfo from "@component/state/review-info";
import SvgMapCurrentLocation from "@/assets/map/map-location.svg";
import UserInfo from "@component/state/user-info";
import { paintStar } from "@component/util";

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
  $searchInput: HTMLInputElement | null;
  $home: HTMLDivElement | null;
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
    this.$searchInput = null;
    this.$home = null;
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
      ${SvgMapCurrentLocation}
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

    this.$home = document.querySelector(
      `.${SELECTOR.HOME_WRAPPER}`
    ) as HTMLDivElement;

    this.$home.addEventListener("click", (e) => {
      const $event = e.target as HTMLElement;
      if ($event.tagName === "INPUT") return;

      this.emitBlurSearchInput();
    });

    const $mapLayout = document.querySelector(
      `.${SELECTOR.HOME_MAP_WRAPPER}`
    ) as Node;

    this.myMap.createMap($mapLayout);

    const homeRect = this.$home.getBoundingClientRect();
    this.viewHeight = homeRect.bottom;

    const selectedRect = this.$selectedPlaceInfo.getBoundingClientRect();
    this.bagicHeight = selectedRect.top;

    this.setupBottomSheetEvents();

    //TODO: menubar toggle button click event
    //분리 해야할지 생각해보기!

    const $visibleMenubarButton = document.querySelector(
      `.${SELECTOR.MENUBAR_TOGGLE_BUTTON}`
    ) as HTMLButtonElement;

    const handleVisibleMenubar = (e: Event) => {
      e.preventDefault();
      this.action.notify(ACTION.MENUBAR_VISIBLE);
    };

    $visibleMenubarButton.addEventListener("click", handleVisibleMenubar);

    const $mylocationButton = document.querySelector(
      `.${SELECTOR.MAP_MY_DIRECTION_BUTTON}`
    ) as HTMLDivElement;

    const handleMyLocation = () => {
      this.myMap.moveCurrentPosition();
    };

    $mylocationButton.addEventListener("click", handleMyLocation);

    const $searchInputButton = document.querySelector(
      `.${SELECTOR.SEARCH_INPUT_BUTTON}`
    ) as HTMLButtonElement;

    this.$searchInput = document.querySelector(
      `.${SELECTOR.SEARCH_KEYWORD}`
    ) as HTMLInputElement;

    const handleKeywordSearch = (e: Event) => {
      //TODO: 정규삭 추가하기
      e.preventDefault();
      if (!this.$searchInput) return;

      const keyword = this.$searchInput.value;
      this.myMap.moveToSearchedPlace(keyword);
    };

    $searchInputButton.addEventListener("click", handleKeywordSearch);
    this.$searchInput.addEventListener("keyup", (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      $searchInputButton.click();
    });
  }

  getSelectPlaceInfo(): SeletedPlaceInfo {
    return { ...(this.selectPlaceInfo as SeletedPlaceInfo) };
    //TODO: 에러처리 필요함!!
  }

  private setupBottomSheetEvents(): void {
    const $layoutMoveButton = document.querySelector(
      `.${SELECTOR.PLACE_INFO_MOVE_BUTTON}`
    ) as HTMLDivElement;

    //터치 이벤트가 존재하는 기기의 바텀시트 이벤트
    // TODO: touch move 시 움직임을 따라가고 있지 않아서 수정 필요해 보임
    const handleTouchStart = () => {
      const handleTouchEnd = (event: TouchEvent) => {
        if (!this.$selectedPlaceInfo) return;
        this.$home?.removeEventListener("touchend", handleTouchEnd);

        const rect = this.$selectedPlaceInfo.getBoundingClientRect();
        const selectedPositionY = rect.top;
        this.repositionPlaceInfoLayer(event, selectedPositionY);
      };

      this.$home?.addEventListener("touchend", handleTouchEnd);
    };

    $layoutMoveButton.addEventListener("touchstart", handleTouchStart);

    this.action.subscribe(ACTION.PLACE_LAYER_UP, () => {
      $layoutMoveButton.removeEventListener("touchstart", handleTouchStart);
      this.$home?.addEventListener("touchstart", handleTouchStart);
    });

    this.action.subscribe(ACTION.PLACE_LAYER_DOWN, () => {
      this.$home?.removeEventListener("touchstart", handleTouchStart);
      $layoutMoveButton.addEventListener("touchstart", handleTouchStart);
    });

    //터치 이벤트가 존재하지 않는 기기의 바텀시트 이벤트
    //TODO: 액션 추가, reposition 추가
    const handleMouseDown = (event: MouseEvent) => {
      event.preventDefault();

      if (!this.$selectedPlaceInfo) return;

      const moveAt = (pageY: number) => {
        if (!this.$selectedPlaceInfo) return;
        this.$selectedPlaceInfo.style.top = pageY - shiftY + "px";
      };

      let shiftY =
        event.clientY - this.$selectedPlaceInfo.getBoundingClientRect().top;

      moveAt(event.pageY);

      const handleMouseMove = (event: MouseEvent) => {
        event.preventDefault();
        moveAt(event.pageY);
      };

      document.addEventListener("mousemove", handleMouseMove);

      const handleMouseUp = () => {
        if (!this.$selectedPlaceInfo) return;

        document.removeEventListener("mousemove", handleMouseMove);
        this.$selectedPlaceInfo.removeEventListener("mouseup", handleMouseUp);
      };

      this.$selectedPlaceInfo.addEventListener("mouseup", handleMouseUp);
    };

    this.$selectedPlaceInfo?.addEventListener("mousedown", handleMouseDown);
    this.$selectedPlaceInfo?.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
  }

  private initSelectedPlace(placeInfo: SeletedPlaceInfo): void {
    const $simplePlaceInfo = document.querySelector(
      `.${SELECTOR.SIMPLE_PLACE_INFO}`
    ) as HTMLDivElement;

    this.setSelectPlaceInfo(placeInfo);
    const bookmarkList = this.userInfo.getBookmarkList();
    const isBookmark = bookmarkList.some((e) => e.place_id === placeInfo.id);
    const roundStarAvg = Math.ceil(placeInfo.star_avg);

    const placeContent = /*html*/ `
      <div class="${SELECTOR.PLACE_CONTENT_WRAPPER}">
        <span class="${SELECTOR.CONTENT_BOOKMARK}">
          <img src="${
            isBookmark ? IMG.FILL_BOOKMARK : IMG.EMPTY_BOOKMARK
          }" data-toggle="${isBookmark}" alt="bookmark"> 
        </span>
        <h1 class="${SELECTOR.CONTENT_NAME}">${placeInfo.place_name}</h1>
        <span class="${SELECTOR.CONTENT_STAR}">
          ${paintStar(roundStarAvg)}
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
      const { id, place_name, x, y, star_avg } = this.getSelectPlaceInfo();

      const newPlaceInfo = {
        place_id: id,
        place_name,
        position_x: x,
        position_y: y,
        star_average: star_avg,
      };

      this.userInfo.toggleBookmark($bookmarkImg, newPlaceInfo);
    });

    $bookmark.addEventListener("touchend", (e: Event) => {
      e.stopPropagation();
    });

    $simplePlaceInfo.addEventListener("click", (e: Event) => {
      this.changePlaceInfoLayer("up");
    });
  }

  private repositionPlaceInfoLayer(
    e: TouchEvent,
    currentPositionY: number
  ): void {
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

  private modifyPlaceInfoStyle($target: HTMLElement, isUp: boolean): void {
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
  ): void {
    removeList?.forEach((name) => $target.classList.remove(name));
    addList?.forEach((name) => $target.classList.add(name));
  }

  private addPlaceInfoElement(): void {
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

    const $addressCopy = $detailContentWrapper.querySelector(
      `.${SELECTOR.CONTENT_ADDRESS_COPY}`
    ) as HTMLSpanElement;

    $addressCopy.addEventListener("click", () => {
      if (!this.selectPlaceInfo) return;

      Android.showToast("주소가 복사 됐습니다.");
      Android.copyToClipboard(this.selectPlaceInfo.road_address_name);
    });

    $addressCopy.addEventListener("touchend", (e: Event) => {
      e.stopPropagation();
    });
  }

  private changePlaceInfoLayer(move: MoveParameter): void {
    if (this.$selectedPlaceInfo === null) return;
    const $detailContentWrapper = this.$selectedPlaceInfo?.querySelector(
      `.${SELECTOR.TOGGLE_PLACE_INFO}`
    ) as HTMLDivElement;

    if (move === "up" || move === "down") {
      const $placeInfo = this.$selectedPlaceInfo.querySelector(
        `.${SELECTOR.PLACE_WRAPPER} div`
      ) as HTMLElement;
      this.modifyPlaceInfoStyle($placeInfo, move === "up");

      //TODO:  이 부분 다 액션에 넣기
      if (move === "up") {
        this.toggleClassName(
          $detailContentWrapper,
          [SELECTOR.DETAIL_CONTENT_WRAPPER],
          [SELECTOR.NONE]
        );
        this.addPlaceInfoElement();
        this.action.notify(ACTION.PLACE_LAYER_UP);
      } else {
        this.toggleClassName(
          $detailContentWrapper,
          [SELECTOR.NONE],
          [SELECTOR.DETAIL_CONTENT_WRAPPER]
        );
        this.action.notify(ACTION.PLACE_LAYER_DOWN);
      }
    }

    const moveY = move === "up" ? this.bagicHeight : 0;
    this.$selectedPlaceInfo.style.transform = `translate3d(0,-${moveY}px,0)`;
  }

  private setSelectPlaceInfo(newSelectPlaceInfo: SeletedPlaceInfo): void {
    this.selectPlaceInfo = { ...newSelectPlaceInfo };
  }

  private emitBlurSearchInput(): void {
    if (!this.$searchInput) return;
    this.$searchInput.blur();
  }
}
