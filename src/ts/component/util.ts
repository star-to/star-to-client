import { IMG } from "../const";

const paintStar = (count: number): string => {
  let starElement = "";

  for (let j = 1; j <= 5; j++) {
    starElement += /*html*/ `
          <img src="${count >= j ? IMG.FILL_STAR : IMG.EMPTY_STAR}">
        `;
  }

  return starElement;
};

const isTouchDevice = (): boolean => {
  return navigator.maxTouchPoints > 0;
};

export { paintStar, isTouchDevice };
