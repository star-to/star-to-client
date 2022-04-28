import Router from "./router";
import Action from "./component/state/action";
import UserInfo from "./component/state/user-info";
import MyMap from "./component/main/my-map";
import ReviewInfo from "./component/state/review-info";
import { ACTION } from "./const";

export type AppParams = {
  action: Action;
  userInfo: UserInfo;
  myMap: MyMap;
  reviewInfo: ReviewInfo;
};

function main() {
  const action = new Action();
  const userInfo = new UserInfo(action);
  const myMap = new MyMap(action);
  const reviewInfo = new ReviewInfo(action);
  action.createObservers(ACTION.INIT_APP);
  myMap.init();
  userInfo.init();
  reviewInfo.init();
  const params = {
    action,
    userInfo,
    myMap,
    reviewInfo,
  };
  new Router(params);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
