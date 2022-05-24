import { Component } from "../component";
import Action from "../state/action";
import { PATH, SELECTOR } from "../../const";
import ReviewInfo from "../state/review-info";

export default class ReviewLocation implements Component {
  action: Action;
  reviewInfo: ReviewInfo;

  constructor(action: Action, reviewInfo: ReviewInfo) {
    this.action = action;
    this.reviewInfo = reviewInfo;
  }

  paint(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
    <div class="${SELECTOR.REVIEW_LOCATION_WRAPPER}">
      <div class="${SELECTOR.REVIEW_LOCATION_TITLE}">
        지금 어디에 계신가요??
      </div>
      <div class="${SELECTOR.REVIEW_LOCATION_CONTENTS_WRAPPER}">
        <div class="${SELECTOR.REVIEW_LOCATION_CONTENTS}">
        </div>
      </div>
    </div>
    `;
  }

  init(): void {
    const $main = document.querySelector(
      `.review-location-wrapper`
    ) as HTMLDivElement;

    const $contents = $main.querySelector(
      `.review-location__contents`
    ) as HTMLDivElement;

    const mainPlaceId = this.reviewInfo.getMainPlaceId();
    const placeList = this.reviewInfo.getPlaceList();

    const locationList = placeList.reduce((acc, cur) => {
      if (cur.id === mainPlaceId) return acc;
      acc += `<button id="${cur.id}">${cur.place_name}</button>`;
      return acc;
    }, "");

    $contents.innerHTML = locationList;

    $contents.addEventListener("click", (e: Event) => {
      const $target = e.target as HTMLElement;

      if ($target.tagName !== "BUTTON") return;

      this.reviewInfo.modifyMainPlaceId($target.id);

      const anchor = document.createElement("a");
      anchor.href = PATH.REVIEW;
      $target.appendChild(anchor);
      anchor.click();
    });
  }
}
