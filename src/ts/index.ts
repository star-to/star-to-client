import Router from "./router";
import Action from "./component/state/action";
import UserInfo from "./component/state/user-info";
import MyMap from "./component/main/my-map";
// import MapOption from "./component/state/map-option";
import { ACTION } from "./const";

export type AppParams = {
  action: Action;
  userInfo: UserInfo;
  myMap: MyMap;
};

function main() {
  const action = new Action();
  const userInfo = new UserInfo(action);
  const myMap = new MyMap(action);
  action.createObservers(ACTION.INIT_APP);
  myMap.init();
  userInfo.init();
  const params = {
    action,
    userInfo,
    myMap,
  };
  new Router(params);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
