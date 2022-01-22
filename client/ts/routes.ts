import { Component } from "./component/component";
import Loading from "./component/main/loading";
import Login from "./component/main/login";
import Home from "./component/main/home";
import MenuBar from "./component/sidebar/menubar";
import Action from "./component/state/action";

export type ComponentFunction = (action: Action) => Component;

export interface PageRoute {
  path: string;
  components: ComponentFunction[];
}

export const routes = [
  { path: "/loading", components: [() => new Loading()] },
  { path: "/login", components: [() => new Login()] },
  {
    path: "/home",
    components: [
      (action: Action) => new Home(action),
      (action: Action) => new MenuBar(action),
    ],
  },
];
