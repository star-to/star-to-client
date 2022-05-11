import { Component } from "../component";
import Action from "../state/action";
import { PATH, SELECTOR } from "../../const";
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
      <div class="review-detail__title">
        <H2>화장실이 어땠나요?</H2>
      </div>
      <div class="review-detail__content-wrapper">
      </div>
      <div class="review-detail__button-wrapper">
        <button class="review-detail__submit-button">
        <a href="${PATH.HOME}">리뷰 남기기</a> 
        </button>
      </div>
    </div>
    `;
  }

  init(): void {
    const $main = document.querySelector(
      `.review-detail-wrapper`
    ) as HTMLDivElement;
    const $contentWrapper = $main.querySelector(
      `.review-detail__content-wrapper`
    ) as HTMLDivElement;
    const $buttonWrapper = $main.querySelector(
      `.review-detail__button-wrapper`
    ) as HTMLDivElement;

    this.contentsList = this.reviewInfo.getDetailContents();

    const nullList = this.contentsList.filter((e) => e.pair_id === null);
    const pairCount = (this.contentsList.length - nullList.length) / 2;

    // TODO: 요론게 중복처럼 보이는데 함수로 뺄지 생각해보기
    let $pairWrapper = "";
    for (let i = 1; i <= pairCount; i++) {
      const pairList = this.contentsList.filter((e) => e.pair_id === i);
      const $pairContent = pairList.reduce((acc, cur) => {
        //TODO: 페어컨텐트는 토글 돼야함
        acc += /*html*/ `
        <button id="${cur.detail_content_id}">
          ${cur.content}
        </button>
        `;
        return acc;
      }, "");

      $pairWrapper += /*html*/ `
        <div class="review-detail__pair-content" id="${i}">
          ${$pairContent}
        </div>
      `;
    }

    const $nullContent = nullList.reduce((acc, cur) => {
      acc += /*html*/ `
        <button id="${cur.detail_content_id}">
          ${cur.content}
        </button>
        `;
      return acc;
    }, "");

    const $nullWrapper = /*html*/ `
      <div class="review-detail__null-content">
        ${$nullContent}
      </div>
    `;

    $contentWrapper.innerHTML = $pairWrapper + $nullWrapper;
  }
}
