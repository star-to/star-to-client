import { Component } from "../component";
import Action from "../state/action";
import { SELECTOR } from "../../const";
import ReviewInfo, { DetailContent } from "../state/review-info";

export default class ReviewDetail implements Component {
  action: Action;
  reviewInfo: ReviewInfo;
  contentsList: DetailContent[];

  constructor(action: Action, reviewInfo: ReviewInfo) {
    this.action = action;
    this.reviewInfo = reviewInfo;
    this.contentsList = [];
  }

  paint(): void {
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
    <div class="review-detail-wrapper">
     리뷰상세
    </div>
    `;
  }

  init(): void {
    this.contentsList = this.reviewInfo.getDetailContents();
  }
}
