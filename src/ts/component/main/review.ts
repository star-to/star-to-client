import { Component } from "../component";
import Action from "../state/action";
import { PATH, SELECTOR } from "../../const";
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
        <div class="${SELECTOR.REVIEW_CONTENT_ANOTHER}">
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
        <button class="${SELECTOR.REVIEW_BUTTON_SUBMIT}">
          <a href="${PATH.REVEIW_DETAIL}">별점 주기</a>  
        </button>
        <button class="${SELECTOR.REVIEW_BUTTON_NEXTDAY}">
          <a href="${PATH.HOME}">다음에 하기</a>
        </button>
      </div>
    </div>
    `;
  }

  init(): void {
    let mainPlaceId = this.reviewInfo.getMainPlaceId();

    if (mainPlaceId === "") {
      mainPlaceId = this.reviewInfo.assignInitPlace();
    }

    const placeList = this.reviewInfo.getPlaceList();
    const mainPlace = placeList.filter((place) => place.id === mainPlaceId)[0];

    const $main = document.querySelector(
      `.${SELECTOR.REVIEW_WRAPPER}`
    ) as HTMLDivElement;

    const $contentWrapper = $main.querySelector(
      `.${SELECTOR.REVIEW_CONTENT_WRAPPER}`
    ) as HTMLDivElement;

    const $mainContent = $contentWrapper.querySelector(
      `.${SELECTOR.REVIEW_CONTENT_MAIN}`
    ) as HTMLDivElement;
    $mainContent.innerHTML = mainPlace.place_name;

    if (placeList.length > 1) {
      const $anotherContent = $contentWrapper.querySelector(
        `.${SELECTOR.REVIEW_CONTENT_ANOTHER}`
      ) as HTMLDivElement;

      $anotherContent.innerHTML = `<a href="${PATH.REVIEW_LOCATION}">
      이 곳이 아니라면...
    </a>`;
    }

    const $ratingStars =
      document.querySelectorAll<HTMLElement>(`.rating__star`);

    const starArr = Array.from($ratingStars);
    this.executeRating(starArr);

    const $submitButton = $main.querySelector(
      `.${SELECTOR.REVIEW_BUTTON_SUBMIT}`
    ) as HTMLButtonElement;

    $submitButton.addEventListener("click", () => {
      const starScore = $main.querySelectorAll(`.fas`).length;

      if (!mainPlaceId) return;

      this.reviewInfo.assignStarScore(starScore);
      this.reviewInfo.assignPlaceId(mainPlaceId);
    });
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
