import { Component } from "../component";
import Action from "../state/action";
import { SELECTOR } from "../../const";
import MyMap from "./my-map";
import ReviewInfo from "../state/review-info";

export default class Review implements Component {
  action: Action;
  myMap: MyMap;
  reviewInfo: ReviewInfo;
  starCount;

  constructor(action: Action, myMap: MyMap, reviewInfo: ReviewInfo) {
    this.action = action;
    this.myMap = myMap;
    this.reviewInfo = reviewInfo;
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
      <div class="${SELECTOR.REVIEW_BUTTON_WRAPPER}">
        <button class="${SELECTOR.REVIEW_BUTTON_SUBMIT}">별점 주기</button>
        <button class="${SELECTOR.REVIEW_BUTTON_NEXTDAY}">다음에 하기</button>
      </div>
    </div>
    `;
  }

  init(): void {
    const placeList = this.reviewInfo.getPlaceList();
    placeList.sort((a, b) => Number(a.distance) - Number(b.distance));
    const mainPlace = placeList[0];

    const $contentWrapper = document.querySelector(
      `.${SELECTOR.REVIEW_CONTENT_WRAPPER}`
    ) as HTMLDivElement;

    const $mainContent = $contentWrapper.querySelector(
      `.${SELECTOR.REVIEW_CONTENT_MAIN}`
    ) as HTMLDivElement;
    $mainContent.innerHTML = mainPlace.place_name;

    if (placeList.length > 1) {
      const button = document.createElement("button");
      button.classList.add(SELECTOR.REVIEW_CONTENT_ANOTHER);
      button.innerHTML = "이 곳이 아니라면...";
      $contentWrapper.append(button);
    }

    const $ratingStars =
      document.querySelectorAll<HTMLElement>(`.rating__star`);

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
