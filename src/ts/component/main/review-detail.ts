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
    <div class="${SELECTOR.REVIEW_DETAIL_WRAPPER}">
      <div class="${SELECTOR.REVIEW_DETAIL_TITLE}">
        <H2>화장실이 어땠나요?</H2>
      </div>
      <div class="${SELECTOR.REVIEW_DETAIL_CONTENTS_WRAPPER}">
      </div>
      <div class="${SELECTOR.REVIEW_DETAIL_BUTTON_WRAPPER}">
        <button class="${SELECTOR.REVIEW_DETAIL_SUBMIT_BUTTON}">
        <a href="${PATH.HOME}">리뷰 남기기</a> 
        </button>
      </div>
    </div>
    `;
  }

  init(): void {
    const $main = document.querySelector(
      `.${SELECTOR.REVIEW_DETAIL_WRAPPER}`
    ) as HTMLDivElement;
    const $contentWrapper = $main.querySelector(
      `.${SELECTOR.REVIEW_DETAIL_CONTENTS_WRAPPER}`
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
        <div class="${SELECTOR.REVIEW_DETAIL_PAIR_CONTENT}" id="${i}">
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
      <div class="${SELECTOR.REVIEW_DETAIL_NULL_CONTENT}">
        ${$nullContent}
      </div>
    `;

    $contentWrapper.innerHTML = $pairWrapper + $nullWrapper;
  }
}
