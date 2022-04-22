import { SELECTOR, EVENT, PATH, ACTION } from "./const";
import { ComponentFunction, createRoutes, RouteList } from "./routes";
import { AppParams } from ".";
import api from "./api";

export default class Router {
  params: AppParams;
  routes: RouteList;

  constructor(params: AppParams) {
    this.params = params;
    this.routes = createRoutes(this.params);
    this.init();
  }
  // 이벤트 생성, 또는 액선 생성 후 상태 컴포넌트의 init 작업이 끝난 후
  // 페이지 라우팅을 할 수 있도록 변경해야함

  init(): void {
    const page = this.findPage(PATH.LOADING);
    this.paintPage(page);

    const handleRoutePage = (event: Event): void => {
      const $event = event.target as HTMLElement;
      const $target = $event.closest("a");

      //TODO: 외부 사이트를 접근하는 anchor 태그를 구분하는 코드 추가 해야함
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

    window.addEventListener("popstate", () => {
      this.emitChangeLocation(EVENT.CHANGE_LOCATION, location.href);
    });

    const response = api.fetchChecedkLogin();
    response
      .then((res) => res.json())
      .then(({ isLogin }) => {
        const url = location.origin;

        if (isLogin) {
          this.params.action.notify(ACTION.INIT_APP);
          const timeId = setInterval(() => {
            const placeList = this.params.myMap.getCurrentPlaceList();
            if (!placeList) return;

            clearInterval(timeId);
            this.router();
          }, 100);

          return;
        }

        this.emitChangeLocation(EVENT.CHANGE_LOCATION, `${url}${PATH.LOGIN}`);
      });
  }

  router() {
    const url = location.origin;
    const pathname = location.pathname;

    this.emitChangeLocation(EVENT.CHANGE_LOCATION, `${url}${pathname}`);
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
    const nextPage = this.routes.find((page) => page.path === path);
    if (!nextPage) {
      //TODO: 에러 처리 코드 추가
      return [];
    }

    return nextPage.components;
  }

  paintPage(pageComponents: ComponentFunction[]): void {
    //TODO: param을 여기서 매개변수로 받아야함
    const page = pageComponents.map((componentfn) => componentfn());

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
