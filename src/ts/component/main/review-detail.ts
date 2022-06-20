import { Component } from "../component";
import Action from "../state/action";
import { ACTION, PATH, SELECTOR } from "../../const";
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
    let pairWrapper = "";
    for (let i = 1; i <= pairCount; i++) {
      const pairList = this.contentsList.filter((e) => e.pair_id === i);
      const pairContent = pairList.reduce((acc, cur) => {
        //TODO: 페어컨텐트는 토글 돼야함
        acc += /*html*/ `
        <button id="${cur.detail_content_id}">
          ${cur.content}
        </button>
        `;
        return acc;
      }, "");

      pairWrapper += /*html*/ `
        <div class="${SELECTOR.REVIEW_DETAIL_PAIR_CONTENT}" id="${i}">
          ${pairContent}
        </div>
      `;
    }

    const nullContent = nullList.reduce((acc, cur) => {
      acc += /*html*/ `
        <button id="${cur.detail_content_id}">
          ${cur.content}
        </button>
        `;
      return acc;
    }, "");

    const nullWrapper = /*html*/ `
      <div class="${SELECTOR.REVIEW_DETAIL_NULL_CONTENT}">
        ${nullContent}
      </div>
    `;

    $contentWrapper.innerHTML = pairWrapper + nullWrapper;

    const $pairContentList = $contentWrapper.querySelectorAll(
      `.${SELECTOR.REVIEW_DETAIL_PAIR_CONTENT}`
    );

    $pairContentList.forEach(($content) => {
      $content.addEventListener("click", (e) => {
        const $targetElement = e.target as HTMLElement;
        if ($targetElement.tagName !== "BUTTON") return;

        const $buttonList =
          $targetElement.parentElement?.querySelectorAll(`button`);

        const list = Array.prototype.slice.call($buttonList);

        const $pairElement = list.find((e) => e.id !== $targetElement.id);

        const isInit =
          !$targetElement.classList.contains(SELECTOR.REVIEW_DETAIL_SELECT) &&
          !$pairElement.classList.contains(SELECTOR.REVIEW_DETAIL_SELECT);

        if (isInit) {
          $targetElement.classList.add(SELECTOR.REVIEW_DETAIL_SELECT);
          return;
        }

        $targetElement.classList.toggle(SELECTOR.REVIEW_DETAIL_SELECT);
        $pairElement.classList.toggle(SELECTOR.REVIEW_DETAIL_SELECT);
      });
    });

    const $nullContent = $contentWrapper.querySelector(
      `.${SELECTOR.REVIEW_DETAIL_NULL_CONTENT}`
    ) as HTMLDivElement;

    $nullContent.addEventListener("click", (e) => {
      const $targetElement = e.target as HTMLElement;

      if ($targetElement.tagName !== "BUTTON") return;

      $targetElement.classList.toggle(SELECTOR.REVIEW_DETAIL_SELECT);
    });

    const $submitButton = $main.querySelector(
      `.${SELECTOR.REVIEW_DETAIL_SUBMIT_BUTTON}`
    ) as HTMLDivElement;

    $submitButton.addEventListener("click", () => {
      //TODO: 폼을 이용하면 조금 더 깔끔하게 될 것같음!!
      const $selectList = $contentWrapper.querySelectorAll(
        `.${SELECTOR.REVIEW_DETAIL_SELECT}`
      );

      const selectIdList: string[] = [];

      $selectList.forEach(($select) => {
        selectIdList.push($select.id);
      });

      this.reviewInfo.assignDetailReview(selectIdList);
      this.reviewInfo.addReveiwPlace();
      //TODO: Submit_Review 구독 해야할지 고민해보기
      const res = this.reviewInfo.saveUserReview();
      // res.then((result) => {
      //   this.action.notify(ACTION.SUBMIT_REVIEW);
      // });
    });
  }
}
