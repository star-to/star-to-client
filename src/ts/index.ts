import Router from "./router";
import Action from "./component/state/action";
import UserInfo from "./component/state/user-info";
import MapOption from "./component/state/map-option";
import { ACTION } from "./const";

function main() {
  const action = new Action();
  const userInfo = new UserInfo(action);
  const mapOption = new MapOption(action);
  action.createObservers(ACTION.INIT_APP);
  mapOption.init();
  userInfo.init();
  new Router(action);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
