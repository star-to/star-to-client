import Action from "./component/state/action";
import { PageRoute, ComponentFunction } from "./routes";
import util from "./util";

export default class Router {
  routes: PageRoute[];

  constructor(routes: PageRoute[]) {
    this.routes = routes;
    this.init();
  }

  init(): void {
    const page = this.findPage("/loading");
    this.paintPage(page);

    document.addEventListener("click", (e: Event) => {
      this.handleRoutePage(e);
    });

    const response = util.fetchChecedkLogin();
    response
      .then((res) => res.json())
      .then(({ isLogin }) => {
        const nextPageComponents = isLogin
          ? this.findPage("/home")
          : this.findPage("/login");
        this.paintPage(nextPageComponents);
      });
  }

  handleRoutePage(event: Event): void {
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

    const nextPageComponents = this.findPage(
      targetElement.dataset.link as string
    );

    this.paintPage(nextPageComponents);
  }

  findPage(path: string): ComponentFunction[] {
    const nextPage = this.routes.find((page: PageRoute) => page.path === path);
    if (!nextPage) {
      //TODO: 에러 처리 코드 추가
      return [];
    }

    return nextPage.components;
  }

  paintPage(pageComponents: ComponentFunction[]): void {
    const action = new Action();
    const page = pageComponents.map((componentfn) => componentfn(action));

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
