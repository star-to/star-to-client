import { PageRoute, Route } from "./routes";
import util from "./util";

export default class Router {
  routes: Route;

  constructor(routes: Route) {
    this.routes = routes;
    this.init();
  }

  init(): void {
    const loading = this.routes.main.find(
      (e: PageRoute) => e.path === "/loading"
    );

    if (!loading) return;

    this.paintPage(loading);
    document.addEventListener("click", (e: Event) => {
      this.handleRoutePage(e);
    });

    const response = util.fetchChecedkLogin();
    response
      .then((res) => res.json())
      .then(({ isLogin }) => {
        // eslint-disable-next-line no-console
        if (!isLogin) {
          const login = this.routes.main.find(
            (e: PageRoute) => e.path === "/login"
          );

          if (!login) return;

          this.paintPage(login);
        }
      });
  }

  handleRoutePage(event: Event): void {
    const targetElement = event.target;
  }

  paintPage(_targetPages: PageRoute): void {
    const mainPage = _targetPages.component();

    const mainWrapper = document.querySelector("main") as HTMLElement;
    mainWrapper.innerHTML = mainPage.getHtml();

    // eslint-disable-next-line no-console
    if (mainPage.subscribeEvent) {
      mainPage.subscribeEvent();
    }
  }

  //   route() {
  //     console.log("route");
  //   }
}
