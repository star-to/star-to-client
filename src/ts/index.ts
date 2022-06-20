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
  //TODO: 안드로이드로 접속했는지 확인 하는 코드!! 플레이 스토어에 업로드 후 주석해제 에정
  // try {
  //   Android;
  // } catch (error) {
  //   location.href = "/web.html";
  //   return;
  // }

  const action = new Action();
  const userInfo = new UserInfo(action);
  const myMap = new MyMap(action);
  const reviewInfo = new ReviewInfo(action);
  //TODO: 액선 생성하는 것 여기다 만들기!!
  action.createObservers(ACTION.INIT_APP);
  action.createObservers(ACTION.UPDATE_MY_REVIEW);
  action.createObservers(ACTION.SELECT_PLACE_MARKER);
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
