import Action from "./action";
import api from "../../api";
import { State, UserInfomation } from "../observable";
import { ACTION } from "../../const";

export default class UserInfo {
  action: Action;
  state: State;
  constructor(action: Action) {
    this.action = action;
    this.state = {};
  }

  init() {
    this.action.createObservers(ACTION.UPDATE_USER_INFO);

    const initUserInfo = () => {
      this.lookupBookmark();
      this.lookupMyReview();
    };

    this.action.subscribe(ACTION.INIT_APP, initUserInfo);
  }

  lookupBookmark() {
    const response = api.readUserBookmark();
    response
      .then((res) => res.json())
      .then(({ result }) => {
        const newState = this.getState();
        newState.bookmark = result;
        this.setState(newState);
      });
  }

  lookupMyReview() {
    //TODO: 사용자 정보 api 요청
    const response = api.readClientReview();
    response
      .then((res) => res.json())
      .then((text: State[]) => {
        const newState = this.getState();
        newState.review = text;
        this.setState(newState);
      });
  }

  getState(): UserInfomation {
    return { ...this.state };
  }

  setState(newState: UserInfomation): void {
    this.state = { ...newState };
    this.action.notify(ACTION.UPDATE_USER_INFO, newState);
  }
}
