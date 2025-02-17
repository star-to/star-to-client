import { SELECTOR } from "@/ts/const";

const Toast = {
  show(message: string, duration: number = 2000, callback?: () => void) {
    const modalElement = document.querySelector(
      `#${SELECTOR.MODAL}`
    ) as HTMLElement;

    if (!modalElement) return;

    const toastHTML = /*html*/ `<div class="${SELECTOR.TOAST}">
      <div class="${SELECTOR.TOAST_CONTENT}">
        ${message}
      </div>
    </div>`;

    modalElement.innerHTML = toastHTML;
    modalElement.className = "";
    modalElement.classList.add(SELECTOR.TOAST_ACTIVE);

    setTimeout(() => {
      modalElement.classList.remove(SELECTOR.TOAST_ACTIVE);
      modalElement.classList.add(SELECTOR.NONE);
      modalElement.innerHTML = "";

      if (callback) callback();
    }, duration);
  },
};

export default Toast;
