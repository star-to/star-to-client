import Router from "./router";
import Action from "./component/state/action";
import UserInfo from "./component/state/user-info";
import MapOption from "./component/state/map-option";
import { ACTION } from "./const";

export type AppParams = {
  action: Action;
  userInfo: UserInfo;
  mapOption: MapOption;
};

function main() {
  const action = new Action();
  const userInfo = new UserInfo(action);
  const mapOption = new MapOption(action);
  action.createObservers(ACTION.INIT_APP);
  mapOption.init();
  userInfo.init();
  const params = {
    action,
    userInfo,
    mapOption,
  };
  new Router(params);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
