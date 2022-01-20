import { Component } from "./component/component";
import Loading from "./component/main/loading";
import Login from "./component/main/login";
import Home from "./component/main/home";
import MenuBar from "./component/sidebar/menubar";

type ComponentFunction = () => Component;

interface PageRoute {
  path: string;
  components: ComponentFunction[];
}

const routes = [
  { path: "/loading", components: [() => new Loading()] },
  { path: "/login", components: [() => new Login()] },
  {
    path: "/home",
    components: [() => new Home(), () => new MenuBar()],
  },
];

export { PageRoute, ComponentFunction, routes };
