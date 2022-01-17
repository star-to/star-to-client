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
    const targetElement = event.target as HTMLElement;

    if (!targetElement.dataset?.list) return;

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
    const page = pageComponents.map((componentfn) => componentfn());

    page.forEach((component) => {
      component.paintComponent();
    });

    page.forEach((component) => {
      if (component.subscribeEvent) {
        component.subscribeEvent();
      }
    });
  }
}
