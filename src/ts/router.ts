import { SELECTOR, EVENT, PATH, ACTION } from "./const";
import { ComponentFunction, createRoutes, Params, RouteList } from "./routes";
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
      const { pathname, state } = (e as CustomEvent).detail;
      this.paintPage(this.findPage(pathname), state);
    });

    window.addEventListener("popstate", () => {
      this.emitChangeLocation(EVENT.CHANGE_LOCATION, location.href);
    });

    api.createReviewInfo();
    const response = api.fetchChecedkLogin();
    response
      .then((res) => res.json())
      .then(({ isLogin }) => {
        const url = location.origin;
        let pathname = location.pathname;

        if (isLogin) {
          this.params.action.notify(ACTION.INIT_APP);
          const timeId = setInterval(() => {
            const isCompleted = this.params.myMap.getIsLoadedCurrentPlaceList();

            if (!isCompleted) return;
            clearInterval(timeId);

            const placeList = this.params.myMap.getCurrentPlaceList();
            if (pathname === PATH.HOME) {
              pathname = placeList.length > 0 ? PATH.REVIEW : PATH.HOME;
            }
            this.params.reviewInfo.addPlaceList(placeList);

            this.router(pathname);
          }, 100);

          return;
        }

        this.emitChangeLocation(EVENT.CHANGE_LOCATION, `${url}${PATH.LOGIN}`);
      });
  }

  router<T>(path: string, state?: T) {
    const url = location.origin;

    if (!state) {
      this.emitChangeLocation(EVENT.CHANGE_LOCATION, `${url}${path}`);
      return;
    }

    this.emitChangeLocation<T>(EVENT.CHANGE_LOCATION, `${url}${path}`, state);
  }

  emitChangeLocation<T>(eventName: string, url: string, state?: T) {
    const reg = new RegExp(`${location.origin}`, "g");
    const pathname = url.replace(reg, "");
    //TODO: 첫 진입에 login은 뒤로 가기에 포함하면 안될 것 같음
    history.pushState(null, pathname, url);
    window.dispatchEvent(
      new CustomEvent(eventName, {
        detail: {
          pathname,
          state: state ? state : null,
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

  paintPage(
    pageComponents: ComponentFunction[],
    params?: KakaoSearchedPlace[]
  ): void {
    const page = pageComponents.map((componentfn) => componentfn(params));

    page.forEach((component) => {
      //TODO: 다름방법 고민해보기!!
      if (!component)
        return this.emitChangeLocation(
          EVENT.CHANGE_LOCATION,
          `${location.origin}${PATH.HOME}`
        );
      component.paint();
    });

    page.forEach((component) => {
      if (!component)
        return this.emitChangeLocation(
          EVENT.CHANGE_LOCATION,
          `${location.origin}${PATH.HOME}`
        );
      if (component.init) {
        component.init();
      }
    });
  }
}
