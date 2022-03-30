import Action from "./action";
import api from "../../api";
import { State } from "../observable";

export default class UserInfo {
  action: Action;
  state: State;
  constructor(action: Action) {
    this.action = action;
    this.state = {};
  }

  init() {
    this.action.createObservers("fetchClientReview");
    this.action.createObservers("updateUserInfo");

    const newUserInfo = () => {
      this.lookupMyReview();
    };
    this.action.subscribe("fetchClientReview", newUserInfo);
  }

  lookupMyReview() {
    //TODO: 사용자 정보 api 요청
    const response = api.fetchClientReview();
    response
      .then((res) => res.json())
      .then((text: State[]) => {
        const newState = this.getState();
        newState.myReview = text;
        this.setState(newState);
        const currentMyReview = this.getState().myReview;
        this.action.notify("updateUserInfo", currentMyReview);
      });
  }

  getState(): State {
    return { ...this.state };
  }

  setState(newState: State): void {
    this.state = { ...newState };
  }
}
