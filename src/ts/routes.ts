import { AppParams } from "@/ts/index";
import Bagic from "@component/header/bagic";
import Bookmark from "@component/main/bookmark";
import { Component } from "@component/component";
import Detail from "@component/main/detail";
import Home from "@component/main/home";
import Loading from "@component/main/loading";
import Login from "@component/main/login";
import MenuBar from "@component/sidebar/menubar";
import MyReview from "@component/main/my-review";
import { PATH } from "@/ts/const";
import Review from "@component/main/review";
import ReviewDetail from "@component/main/review-detail";
import ReviewLocation from "@component/main/review-location";

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
      components: [
        () => new Home(action, myMap, userInfo, reviewInfo),
        () => new MenuBar(action),
      ],
    },
    {
      path: PATH.DETAIL,
      components: [() => new Detail(action), () => new Bagic()],
    },
    {
      path: PATH.MY_REVIEW,
      components: [
        () => new Bagic(),
        () => new MyReview(action, userInfo),
        () => new MenuBar(action),
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
    {
      path: PATH.BOOKMARK,
      components: [
        () => new Bagic(),
        () => new Bookmark(action, userInfo),
        () => new MenuBar(action),
      ],
    },
  ];
}
