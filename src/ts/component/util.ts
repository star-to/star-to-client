import { IMG } from "../const";

const util = {
  paintStar: (count: number): string => {
    let starElement = "";

    for (let j = 1; j <= 5; j++) {
      starElement += /*html*/ `
            <img src="${count >= j ? IMG.FILL_STAR : IMG.EMPTY_STAR}">
          `;
    }

    return starElement;
  },
};

export default util;
