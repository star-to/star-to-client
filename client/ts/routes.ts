import { Component } from "./component/component";
import Loading from "./component/main/loading";
import Login from "./component/main/login";
import Home from "./component/main/home";

type InstanceComponent = () => Component;

interface PageRoute {
  path: string;
  components: InstanceComponent[];
}

const routes = [
  { path: "/loading", components: [() => new Loading()] },
  { path: "/home", components: [() => new Login()] },
  { path: "/home", components: [() => new Home()] },
];

export { PageRoute, routes };
