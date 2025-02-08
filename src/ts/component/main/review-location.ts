import { PATH, SELECTOR } from "@/ts/const";

import Action from "@component/state/action";
import { Component } from "@component/component";
import ReviewInfo from "@component/state/review-info";

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
      acc += `<button id="${cur.id}" data-x="${cur.x}", data-y="${cur.y}">${cur.place_name}</button>`;
      return acc;
    }, "");

    $contents.innerHTML = locationList;

    $contents.addEventListener("click", (e: Event) => {
      const $target = e.target as HTMLElement;

      if ($target.tagName !== "BUTTON") return;

      const existPlaceInfo =
        $target.id && $target.dataset.x && $target.dataset.y;

      if (!existPlaceInfo) return;

      const placeInfo = {
        id: $target.id,
        x: $target.dataset.x ?? null,
        y: $target.dataset.y ?? null,
      };

      this.reviewInfo.changePlace(placeInfo);

      const anchor = document.createElement("a");
      anchor.href = PATH.REVIEW;
      $target.appendChild(anchor);
      anchor.click();
    });
  }
}
