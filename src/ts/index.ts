import { ACTION } from "./const";
import Action from "./component/state/action";
import MapInfo from "./component/state/map-info";
import MyMap from "./component/main/my-map";
import ReviewInfo from "./component/state/review-info";
import Router from "./router";
import UserInfo from "./component/state/user-info";

export type AppParams = {
  action: Action;
  userInfo: UserInfo;
  myMap: MyMap;
  mapInfo: MapInfo;
  reviewInfo: ReviewInfo;
};

function main() {
  // try {
  //   Android;
  // } catch (error) {
  //   location.href = "/web.html";
  //   return;
  // }

  const action = new Action();
  const userInfo = new UserInfo(action);
  const mapInfo = new MapInfo(action);
  const reviewInfo = new ReviewInfo(action);
  const myMap = new MyMap(action, mapInfo);

  action.createObservers(ACTION.INIT_APP);
  action.createObservers(ACTION.UPDATE_MY_REVIEW);
  action.createObservers(ACTION.SELECT_PLACE_MARKER);
  action.createObservers(ACTION.PLACE_LAYER_DOWN);
  action.createObservers(ACTION.PLACE_LAYER_UP);
  myMap.init();
  userInfo.init();
  reviewInfo.init();
  const params = {
    action,
    userInfo,
    myMap,
    mapInfo,
    reviewInfo,
  };
  new Router(params);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
