import { Component } from "./component/component";
import Loading from "./component/main/loading";

interface PageRoute {
  path: string;
  component: () => Component;
}

interface Route {
  main: PageRoute[];
}

const routes = {
  main: [
    { path: "/loading", component: () => new Loading() },
    { path: "home", component: () => new Loading() },
  ],
};

export { PageRoute, Route, routes };
