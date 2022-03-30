import Action from "./component/state/action";
import { SELECTOR } from "./const";
import { PageRoute, ComponentFunction, Params, routes } from "./routes";
import api from "./api";

export default class Router {
  action: Action;
  params: Params;

  constructor(action: Action) {
    this.action = action;
    this.params = {};
    this.init();
  }

  init = (): void => {
    const page = this.findPage("/loading");
    this.paintPage(page);

    document.addEventListener("click", (e: Event) => {
      this.handleRoutePage(e);
    });

    const response = api.fetchChecedkLogin();
    response
      .then((res) => res.json())
      .then(({ isLogin }) => {
        const nextPageComponents = isLogin
          ? this.findPage("/home")
          : this.findPage("/login");
        this.paintPage(nextPageComponents);
      });
  };

  handleRoutePage = (event: Event): void => {
    //TODO: 부모의 부모까지 확인해봐야함 더 효율적인 방법 없을지?
    const eventTarget = event.target as HTMLElement;

    const isLink =
      eventTarget.dataset?.link || eventTarget.parentElement?.dataset?.link
        ? true
        : false;

    if (!isLink) return;

    const targetElement = eventTarget.dataset?.link
      ? eventTarget
      : (eventTarget.parentElement as HTMLElement);

    if (targetElement.dataset.params) {
      const paramData = targetElement.dataset.params?.split("/");

      this.params = paramData.reduce((acc, cur) => {
        const [key, data] = cur.split("=");
        acc[key] = data;

        return acc;
      }, {} as Params);
    }

    const nextPageComponents = this.findPage(
      targetElement.dataset.link as string
    );

    this.removeElementChild();
    this.paintPage(nextPageComponents);
  };

  removeElementChild = (): void => {
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
  };

  findPage = (path: string): ComponentFunction[] => {
    const nextPage = routes.find((page) => page.path === path);
    if (!nextPage) {
      //TODO: 에러 처리 코드 추가
      return [];
    }

    return nextPage.components;
  };

  paintPage = (pageComponents: ComponentFunction[]): void => {
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
  };
}
