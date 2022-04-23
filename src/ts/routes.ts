import { Component } from "./component/component";
import { PATH } from "./const";
import { AppParams } from "./index";
import Loading from "./component/main/loading";
import Login from "./component/main/login";
import Home from "./component/main/home";
import Detail from "./component/main/detail";
import MyReview from "./component/main/my-review";
import Review from "./component/main/review";
import MenuBar from "./component/sidebar/menubar";
import Bagic from "./component/header/bagic";
import Review from "./component/main/review";

export type ComponentFunction = (params?: Params) => Component | null;

export interface PageRoute {
  path: string;
  components: ComponentFunction[];
}

export type Params = {
  [key: string]: string;
};

export type RouteList = PageRoute[];

export function createRoutes(params: AppParams): RouteList {
  const { action, userInfo, myMap } = params;

  return [
    {
      path: PATH.LOADING,
      components: [() => new Loading(action)],
    },
    { path: PATH.LOGIN, components: [() => new Login()] },
    {
      path: PATH.HOME,
      components: [() => new Home(action, myMap), () => new MenuBar(action)],
    },
    {
      path: PATH.DETAIL,
      components: [() => new Detail(action), () => new Bagic()],
    },
    {
      path: PATH.MY_REVIEW,
      components: [
        () => new MyReview(action, userInfo),
        () => new MenuBar(action),
        () => new Bagic(),
      ],
    },
    {
      path: PATH.REVIEW,
      components: [
        (componentParams?: Params) => {
          if (!componentParams) return null;
          return new Review(action, myMap, componentParams);
        },
      ],
    },
  ];
}
