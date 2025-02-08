import UserInfo,{ UserInfomation } from "@component/state/user-info";

import Action from "@component/state/action";
import { Component } from "@component/component";
import { SELECTOR } from "@/ts/const";
import { State } from "@component/observable";
import util from "@component/util";

export default class MyReview implements Component {
  action: Action;
  userInfo: UserInfo;
  reviewList: State[];

  constructor(action: Action, userInfo: UserInfo) {
    this.action = action;
    this.userInfo = userInfo;
    this.reviewList = [];
  }

  paint(): void {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
      <div class="${SELECTOR.MY_REVEIW_WRAPPER}">
        <h2 style="font-size:0.8em; font-weight:600">작성한 리뷰가 없습니다.</h2>
      </div>
      `;
  }

  init(): void {
    this.setReviewList(this.userInfo.getState());
    this.fillReveiw(this.getReviewList());
  }

  fillReveiw(reviewList: State[]): void {
    //TODO: 홈화면에서 구현했던 방식이랑 이 방식중 더 효율적인 것으로 통일!!
    if (reviewList.length === 0) return;

    let addHtml = "";

    addHtml += /*html*/ `<div class="${SELECTOR.MY_REVIEW_LIST_WRAPPER}">`;

    reviewList.forEach((review) => {
      const tmp = review.list as State[];
      addHtml += /*html*/ `
        <ul class="${SELECTOR.MY_REVIEW_LIST}">
        <H1 class="${SELECTOR.MY_REVIEW_DATE}">${review.date}</H1>
          ${tmp.reduce((acc, cur) => {
            //TODO: 각 리스트에 터치 이벤트 달기!!!
            acc += /*html */ `
            <li class="${SELECTOR.MY_REVIEW_CONTENT}">
              <div class="${SELECTOR.MY_REVIEW_CONTENT_WRAPPER}">
                <span class="${SELECTOR.MY_REVIEW_CONTENT_NAME}">${
              cur["place_name"]
            }</span>
                <span class="${
                  SELECTOR.MY_REVIEW_CONTENT_STAR
                }">${util.paintStar(cur["star"] as number)}</span>
              </div>
            </li>
            `;
            return acc;
          }, "")}
        </ul>
      `;
    });

    addHtml += `</div>`;

    const reviewWrapper = document.querySelector(
      `.${SELECTOR.MY_REVEIW_WRAPPER}`
    ) as HTMLDivElement;

    reviewWrapper.innerHTML = addHtml;
  }

  getReviewList(): State[] {
    return [...this.reviewList];
  }

  setReviewList(newUserInfo: UserInfomation) {
    //TODO: State 말고 REVIEW 타입 만들기
    if (!newUserInfo.review) return;
    this.reviewList = [...newUserInfo.review];
  }
}
