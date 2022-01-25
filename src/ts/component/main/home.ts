import { Component } from "../component";
import { SELECTOR, IMG, PATH, ACTION } from "../../const";
import Action from "../state/action";

export default class Home implements Component {
  action: Action;
  html: string;
  bagicHeight: number;
  viewHeight: number;
  recommendLayout: HTMLDivElement | null;
  home: HTMLDivElement | null;
  constructor(action: Action) {
    this.action = action;

    this.html = /*html*/ `
    <div class="${SELECTOR.HOME_WRAPPER}">
      <div class="${SELECTOR.HOME_MAP_WRAPPER}">
      </div>
      <div class="${SELECTOR.MENUBAR_TOGGLE_BUTTON}">
        <img src="${IMG.PLUS}" alt="plus button">
      </div>
      <div class="${SELECTOR.SEARCH_WRAPPER}">
      </div>
      <div class="${SELECTOR.HOME_RECOMMEND_WRAPPER}">
        <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON}">
          <div class="${SELECTOR.RECOMMEND_MOVE_BUTTON_ICON}">
          </div>
        </div>
        <div class="${SELECTOR.RECOMMEND_LIST_WRAPPER}">
          <ul class="${SELECTOR.RECOMMEND_LIST}">
          </ul>
        </div>
      </div>
    </div>`;

    this.bagicHeight = 0;
    this.viewHeight = 0;
    this.recommendLayout = null;
    this.home = null;
  }

  paint(): void {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기

    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = this.html;
  }

  init(): void {
    this.recommendLayout = document.querySelector(
      `.${SELECTOR.HOME_RECOMMEND_WRAPPER}`
    ) as HTMLDivElement;

    this.home = document.querySelector(
      `.${SELECTOR.HOME_WRAPPER}`
    ) as HTMLDivElement;

    const layoutMoveButton = document.querySelector(
      `.${SELECTOR.RECOMMEND_MOVE_BUTTON}`
    ) as HTMLDivElement;

    const homeRect = this.home.getBoundingClientRect();
    this.viewHeight = homeRect.bottom;

    const recommendRect = this.recommendLayout.getBoundingClientRect();
    this.bagicHeight = recommendRect.top;

    const recommendList = document.querySelector(
      `.${SELECTOR.RECOMMEND_LIST}`
    ) as HTMLUListElement;

    for (let i = 0; i < 10; i++) {
      this.predrawElement("li", recommendList);
    }

    //TODO: test 데이터
    const cafeList = [
      {
        id: 1,
        name: "카페마스",
        star: 4,
        comment: 12,
        time: 3,
        bookmark: true,
      },
      {
        id: 2,
        name: "투썸플레이스",
        star: 5,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 2,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 1,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 0,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 4,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 4,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 4,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 4,
        comment: 10,
        time: 5,
        bookmark: false,
      },
      {
        id: 3,
        name: "투썸플레이스",
        star: 4,
        comment: 10,
        time: 5,
        bookmark: false,
      },
    ];

    this.fillRecommendList(cafeList);

    const handleTouchStart = () => {
      const handleTouchMove = (event: TouchEvent) => {
        this.moveReccommendLayer(event);
      };

      const handleTouchEnd = (event: TouchEvent) => {
        this.home?.removeEventListener("touchmove", handleTouchMove);
        this.home?.removeEventListener("touchend", handleTouchEnd);
        this.repositionReccommendLayer(event);
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

    visibleMenubarButton.addEventListener("click", (e: Event) => {
      e.preventDefault();
      this.action.notify(ACTION.MENUBAR_VISIBLE);
    });
  }

  moveReccommendLayer(e: TouchEvent) {
    if (this.recommendLayout === null) return;

    const moveY = this.bagicHeight - e.changedTouches[0].clientY;
    this.recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
  }

  repositionReccommendLayer(e: TouchEvent) {
    if (this.recommendLayout === null) return;

    const currentY = e.changedTouches[0].clientY;
    const middleHeigth = this.viewHeight / 2;

    const isUp = middleHeigth > currentY;
    const moveY = isUp ? this.bagicHeight : 0;

    const recommendListWrapper = document.querySelector(
      `.${SELECTOR.RECOMMEND_LIST_WRAPPER}`
    ) as HTMLDivElement;
    recommendListWrapper.style.overflow = isUp ? "scroll" : "hidden";

    this.recommendLayout.style.transform = `translate3d(0,-${moveY}px,0)`;
  }

  fillRecommendList(recommendList: PlaceInfo[]) {
    //TODO:실제 데이터 받아서 해봐야 함
    //그 이후에 함수로 분리하거나 클래스로 분리!

    const liElements = document.querySelectorAll(
      `.${SELECTOR.RECOMMEND_LIST} li`
    );

    for (let i = 0; i < liElements.length; i++) {
      const { id, name, star, comment, time, bookmark } = recommendList[i];

      const wrapper = document.createElement("div");
      wrapper.classList.add(SELECTOR.RECOMMEND_LIST_CONTENTT);
      wrapper.dataset.link = PATH.DETAIL;
      wrapper.dataset.params = `id=${id}`;

      const nameElement = document.createElement("H1");
      nameElement.innerHTML = name;
      nameElement.classList.add(SELECTOR.CONTENT_NAME);

      const starElememt = document.createElement("span");
      starElememt.classList.add(SELECTOR.CONTENT_STAR);

      for (let j = 1; j <= 5; j++) {
        const starimg = document.createElement("img");
        starimg.src = star >= j ? IMG.FILL_STAR : IMG.EMPTY_STAR;

        starElememt.append(starimg);
      }

      const commentElement = document.createElement("span");
      commentElement.classList.add(SELECTOR.CONTENT_COMMENT);
      commentElement.innerHTML = `(${comment})`;

      const timeElement = document.createElement("div");
      timeElement.classList.add(SELECTOR.CONTENT_TIME);
      timeElement.innerHTML = `${time}분 이내에 도착할 수 있습니다.`;

      const bookmarkElement = document.createElement("span");
      const bookmarkImage = document.createElement("img");
      bookmarkImage.src = bookmark ? IMG.FILL_BOOKMARK : IMG.EMPTY_BOOKMARK;
      bookmarkImage.alt = "bookmark";

      bookmarkElement.append(bookmarkImage);
      bookmarkElement.classList.add(SELECTOR.CONTENT_BOOKMARK);

      wrapper.append(bookmarkElement);
      wrapper.append(nameElement);
      wrapper.append(starElememt);
      wrapper.append(commentElement);
      wrapper.append(timeElement);

      liElements[i].append(wrapper);
    }
  }

  predrawElement(tagName: string, parentElement: HTMLElement): void {
    const newElement = document.createElement(tagName);
    parentElement.append(newElement);
  }
}

type PlaceInfo = {
  id: number;
  name: string;
  star: number;
  comment: number;
  time: number;
  bookmark: boolean;
};
