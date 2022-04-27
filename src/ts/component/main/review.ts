import { Component } from "../component";
import Action from "../state/action";
import { SELECTOR } from "../../const";
import MyMap from "./my-map";

export default class Review implements Component {
  action: Action;
  myMap: MyMap;
  //TODO: 자료형 만들어야할 듯
  placeList: KakaoSearchedPlace[];
  starCount;

  constructor(action: Action, myMap: MyMap, placeList: KakaoSearchedPlace[]) {
    this.action = action;
    this.myMap = myMap;
    this.placeList = placeList;
    this.starCount = 0;
  }

  paint(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
    <div class="${SELECTOR.REVIEW_WRAPPER}">
      <div class="${SELECTOR.REVIEW_CONTENT_WRAPPER}">
        <div class="${SELECTOR.REVIEW_CONTENT_MAIN}">
        </div>
      </div>
      <div class="${SELECTOR.REVIEW_STAR_WRAPPER}">
        <div class="${SELECTOR.REVIEW_STAR_TITLE}">
          <H2>화장실 별점은~</H2>
        </div>
        <div class="${SELECTOR.REVIEW_STAR}">
          <i class="rating__star far fa-star"></i>
          <i class="rating__star far fa-star"></i>
          <i class="rating__star far fa-star"></i>
          <i class="rating__star far fa-star"></i>
          <i class="rating__star far fa-star"></i>
        </div>
      </div>
    </div>
    `;
  }

  init(): void {
    this.placeList.sort((a, b) => Number(a.distance) - Number(b.distance));
    const mainPlace = this.placeList[0];

    const $contentWrapper = document.querySelector(
      `.${SELECTOR.REVIEW_CONTENT_WRAPPER}`
    ) as HTMLDivElement;

    const $mainContent = $contentWrapper.querySelector(
      `.${SELECTOR.REVIEW_CONTENT_MAIN}`
    ) as HTMLDivElement;
    $mainContent.innerHTML = mainPlace.place_name;

    if (this.placeList.length > 1) {
      const button = document.createElement("button");
      button.classList.add(SELECTOR.REVIEW_CONTENT_ANOTHER);
      button.innerHTML = "이 곳이 아니라면...";
      $contentWrapper.append(button);
    }

    const $ratingStars = document.querySelectorAll<HTMLElement>(
      `.${SELECTOR.REVIEW_STAR}`
    );

    const starArr = Array.from($ratingStars);
    this.executeRating(starArr);
  }

  executeRating(stars: HTMLElement[]) {
    const starClassActive = "rating__star fas fa-star";
    const starClassInactive = "rating__star far fa-star";
    const starsLength = stars.length;
    let i;

    stars.map((star) => {
      star.onclick = () => {
        i = stars.indexOf(star);
        this.starCount = i + 1;

        if (star.className === starClassInactive) {
          for (i; i >= 0; --i) {
            stars[i].className = starClassActive;
          }
        } else {
          for (++i; i < starsLength; ++i) {
            stars[i].className = starClassInactive;
          }
        }
      };
    });
  }
}
