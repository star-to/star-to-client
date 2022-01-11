import { Component } from "./component/component";
import Loading from "./component/main/loading";
import Login from "./component/main/login";

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
    { path: "/login", component: () => new Login() },
  ],
};

export { PageRoute, Route, routes };
