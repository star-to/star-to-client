import { PageRoute, Route } from "./routes";

export default class Router {
  routes: Route;

  constructor(routes: Route) {
    this.routes = routes;
    this.init();
  }

  init(): void {
    const main = this.routes.main.find((e: PageRoute) => e.path === "/loading");

    if (!main) {
      return;
    }

    this.paintPage(main);

    document.addEventListener("click", (e: Event) => {
      this.handleRoutePage(e);
    });

    navigator.geolocation.getCurrentPosition((res) => {
      alert(JSON.stringify(res.coords));
    });
  }

  handleRoutePage(event: Event): void {
    const targetElement = event.target;
  }

  paintPage(_targetPages: PageRoute): void {
    const mainPage = _targetPages.component();

    const mainWrapper = document.querySelector("main") as HTMLElement;
    mainWrapper.innerHTML = mainPage.getHtml();
  }

  //   route() {
  //     console.log("route");
  //   }
}
