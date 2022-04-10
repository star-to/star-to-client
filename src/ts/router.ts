import Action from "./component/state/action";
import { SELECTOR, EVENT, PATH } from "./const";
import { ComponentFunction, Params, routes } from "./routes";
import api from "./api";

export default class Router {
  action: Action;
  params: Params;

  constructor(action: Action) {
    this.action = action;
    this.params = {};
    this.init();
  }

  init(): void {
    const page = this.findPage(PATH.LOADING);
    this.paintPage(page);

    const handleRoutePage = (event: Event): void => {
      const $event = event.target as HTMLElement;
      const $target = $event.closest("a");
      if (!$target) return;

      event.preventDefault();

      this.emitChangeLocation(EVENT.CHANGE_LOCATION, $target.href);
    };

    document.addEventListener("click", handleRoutePage);

    window.addEventListener(EVENT.CHANGE_LOCATION, (e: Event) => {
      this.removeElementChild();
      const { pathname } = (e as CustomEvent).detail;
      this.paintPage(this.findPage(pathname));
    });

    window.addEventListener("popstate", (e) => {
      this.emitChangeLocation(EVENT.CHANGE_LOCATION, location.href);
    });

    const response = api.fetchChecedkLogin();
    response
      .then((res) => res.json())
      .then(({ isLogin }) => {
        const url = isLogin ? location.href : `${location.origin}${PATH.LOGIN}`;
        this.emitChangeLocation(EVENT.CHANGE_LOCATION, url);
      });
  }

  emitChangeLocation(eventName: string, url: string) {
    const reg = new RegExp(`${location.origin}`, "g");
    const pathname = url.replace(reg, "");
    history.pushState(null, pathname, url);
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          pathname,
        },
      })
    );
  }

  removeElementChild(): void {
    const header = document.querySelector(`${SELECTOR.HEADER}`) as HTMLElement;
    const main = document.querySelector(`.${SELECTOR.MAIN}`) as HTMLElement;
    const sidebar = document.querySelector(
      `.${SELECTOR.SIDEBAR}`
    ) as HTMLElement;

    if (header) {
      header.innerHTML = "";
      header.removeAttribute("class");
    }

    if (main) {
      main.innerHTML = "";
      main.removeAttribute("class");
    }

    if (sidebar) {
      sidebar.innerHTML = "";
      sidebar.removeAttribute("class");
    }
  }

  findPage(path: string): ComponentFunction[] {
    const nextPage = routes.find((page) => page.path === path);
    if (!nextPage) {
      //TODO: 에러 처리 코드 추가
      return [];
    }

    return nextPage.components;
  }

  paintPage(pageComponents: ComponentFunction[]): void {
    //TODO: param을 여기서 매개변수로 받아야함
    const page = pageComponents.map((componentfn) =>
      componentfn(this.action, this.params)
    );

    page.forEach((component) => {
      component.paint();
    });

    page.forEach((component) => {
      if (component.init) {
        component.init();
      }
    });
  }
}
