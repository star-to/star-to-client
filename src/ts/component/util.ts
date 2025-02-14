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

const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay = 300
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};
export { paintStar, isTouchDevice, debounce };
