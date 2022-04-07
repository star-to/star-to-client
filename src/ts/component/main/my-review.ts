import { Component } from "../component";
import Action from "../state/action";
import { SELECTOR, IMG, ACTION } from "../../const";
import { State } from "../observable";

export default class MyReview implements Component {
  action: Action;

  constructor(action: Action) {
    this.action = action;
  }

  paint = (): void => {
    //TODO: 메인 래퍼를 구분할 필요가 있다면 main 에 셀렉터 부여하기
    const mainWrapper = document.querySelector(
      `${SELECTOR.MAIN}`
    ) as HTMLElement;

    mainWrapper.innerHTML = /*html*/ `
      <div class="${SELECTOR.MY_REVEIW_WRAPPER}">
      </div>
      `;
  };

  init = (): void => {
    this.action.subscribe(ACTION.UPDATE_USER_INFO, this.fillReveiw);

    this.action.notify(ACTION.GET_USER_REVIEW);
  };

  fillReveiw = (reviewList: State[]): void => {
    //TODO: 홈화면에서 구현했던 방식이랑 이 방식중 더 효율적인 것으로 통일!!
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
              cur["placeName"]
            }</span>
                <span class="${
                  SELECTOR.MY_REVIEW_CONTENT_STAR
                }">${this.paintStar(cur["star"] as number)}</span>
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
  };

  paintStar = (count: number): string => {
    let starElement = "";

    for (let j = 1; j <= 5; j++) {
      starElement += /*html*/ `
        <img src="${count >= j ? IMG.FILL_STAR : IMG.EMPTY_STAR}">
      `;
    }

    return starElement;
  };
}
