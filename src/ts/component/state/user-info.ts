import Action from "./action";
import api from "../../api";
import { State } from "../observable";
import { ACTION } from "../../const";

export default class UserInfo {
  action: Action;
  state: State;
  constructor(action: Action) {
    this.action = action;
    this.state = {};
  }

  init() {
    this.action.createObservers(ACTION.GET_USER_REVIEW);
    this.action.createObservers(ACTION.UPDATE_USER_INFO);

    const initUserInfo = () => {
      this.lookupBookmark();
      this.lookupMyReview();
    };

    this.action.subscribe(ACTION.INIT_APP, initUserInfo);

    const getUserReview = () => {
      this.action.notify(ACTION.UPDATE_USER_INFO, this.getState().review);
    };

    this.action.subscribe(ACTION.GET_USER_REVIEW, getUserReview);
  }

  lookupBookmark() {
    const response = api.fetchUserBookmark();
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
    const response = api.fetchClientReview();
    response
      .then((res) => res.json())
      .then((text: State[]) => {
        const newState = this.getState();
        newState.review = text;
        this.setState(newState);
      });
  }

  getState(): State {
    return { ...this.state };
  }

  setState(newState: State): void {
    this.state = { ...newState };
  }
}
