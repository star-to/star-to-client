import { routes } from "./routes";
import Router from "./router";

function main() {
  const router = new Router(routes);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
