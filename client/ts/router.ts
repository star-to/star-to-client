import { route } from "./routes";

export default class Router {
  routes: route;

  constructor(routes: route) {
    this.routes = routes;
    this.init();
  }

  init() {
    const loading = this.routes.main.loading();
    const mainElement = document.querySelector("main") as HTMLElement;
    mainElement.innerHTML = loading.getHtml();
  }

  //   route() {
  //     console.log("route");
  //   }
}
