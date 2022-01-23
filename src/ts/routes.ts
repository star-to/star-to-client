import { Component } from "./component/component";
import { PATH } from "./const";
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
  { path: PATH.LOADING, components: [() => new Loading()] },
  { path: PATH.LOGIN, components: [() => new Login()] },
  {
    path: PATH.HOME,
    components: [
      (action: Action) => new Home(action),
      (action: Action) => new MenuBar(action),
    ],
  },
];
