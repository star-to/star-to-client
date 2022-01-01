import { routes } from "./routes";
import Router from "./router";

function main() {
  new Router(routes);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
