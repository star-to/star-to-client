import { PageRoute } from "./routes";
import util from "./util";

export default class Router {
  routes: PageRoute[];

  constructor(routes: PageRoute[]) {
    this.routes = routes;
    this.init();
  }

  init(): void {
    const loading = this.routes.find((e: PageRoute) => e.path === "/loading");

    if (!loading) return;

    this.paintPage(loading);
    document.addEventListener("click", (e: Event) => {
      this.handleRoutePage(e);
    });

    const response = util.fetchChecedkLogin();
    response
      .then((res) => res.json())
      .then(({ isLogin }) => {
        if (!isLogin) {
          const login = this.routes.find((e: PageRoute) => e.path === "/login");

          if (!login) return;

          this.paintPage(login);
        }
      });
  }

  handleRoutePage(event: Event): void {
    const targetElement = event.target as HTMLElement;
    // eslint-disable-next-line no-console
    console.log(targetElement);

    if (!targetElement.dataset?.list) return;
  }

  paintPage(_targetPages: PageRoute): void {
    const page = _targetPages.components.map((component) => component());

    page.forEach((component) => {
      component.paintComponent();

      window.addEventListener("DOMContentlLoaded", () => {
        if (component.subscribeEvent) {
          component.subscribeEvent();
        }
      });
    });
  }

  //   route() {
  //     console.log("route");
  //   }
}
