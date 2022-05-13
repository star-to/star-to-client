import { Component } from "./component/component";
import { PATH } from "./const";
import { AppParams } from "./index";
import Loading from "./component/main/loading";
import Login from "./component/main/login";
import Home from "./component/main/home";
import Detail from "./component/main/detail";
import MyReview from "./component/main/my-review";
import MenuBar from "./component/sidebar/menubar";
import Bagic from "./component/header/bagic";
import Review from "./component/main/review";
import ReviewDetail from "./component/main/review-detail";
import ReviewLocation from "./component/main/review-location";

export type ComponentFunction = (
  params?: KakaoSearchedPlace[]
) => Component | null;

export interface PageRoute {
  path: string;
  components: ComponentFunction[];
}

export type Params = {
  [key: string]: string;
};

export type RouteList = PageRoute[];

export function createRoutes(params: AppParams): RouteList {
  const { action, userInfo, myMap, reviewInfo } = params;

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
      components: [() => new Review(action, myMap, reviewInfo)],
    },
    {
      path: PATH.REVEIW_DETAIL,
      components: [() => new ReviewDetail(action, reviewInfo)],
    },
    {
      path: PATH.REVIEW_LOCATION,
      components: [() => new ReviewLocation(action, reviewInfo)],
    },
  ];
}
