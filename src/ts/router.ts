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
        const url = location.origin;

        if (isLogin) {
          this.params.action.notify(ACTION.INIT_APP);
          const mapOptions = this.params.myMap.getOptions();

          if (!mapOptions.center)
            return this.emitChangeLocation(
              EVENT.CHANGE_LOCATION,
              `${url}${PATH.HOME}`
            );

          const serachOption = {
            location: mapOptions.center,
            radius: 0,
          };

          //TODO: 좌표를 주소로 변환하는 함수를 이용하고, 그 주소로 키워드 검색을 하는 식으로 변경
          return this.params.myMap.searchCategory(
            serachOption,
            (data: KakaoSearchedPlace[]) => {
              const path = data.length === 0 ? location.pathname : PATH.REVIEW;
              return this.emitChangeLocation(
                EVENT.CHANGE_LOCATION,
                `${url}${path}`
              );
            }
          );
        }

        this.emitChangeLocation(EVENT.CHANGE_LOCATION, `${url}${PATH.LOGIN}`);
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
