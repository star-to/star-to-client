import Router from "./router";
import Action from "./component/state/action";
import UserInfo from "./component/state/user-info";

function main() {
  const action = new Action();
  const userInfo = new UserInfo(action);
  userInfo.init();
  new Router(action);
}

window.addEventListener("DOMContentLoaded", () => {
  main();
});
