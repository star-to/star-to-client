import Action from "./action";
import api from "../../api";
import { State } from "../observable";
import { ACTION } from "../../const";

export type UserInfomation = {
  bookmark?: string[];
  review?: State[];
};

export default class UserInfo {
  action: Action;
  state: UserInfomation;
  constructor(action: Action) {
    this.action = action;
    this.state = {};
  }

  init() {
    const initUserInfo = () => {
      this.lookupBookmark();
      this.lookupMyReview();
    };

    this.action.subscribe(ACTION.INIT_APP, initUserInfo);
    this.action.subscribe(ACTION.UPDATE_MY_REVIEW, () => {
      this.lookupMyReview();
    });
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

  addBookmark(id: string) {
    const newState = this.getState();
    newState.bookmark?.push(id);
    this.setState(newState);
  }

  deleteBookmark(id: string) {
    //TODO: 실질적인 db 데이터를 조회한 것은 아니라서 이렇게 해도 될지 고민
    const newState = this.getState();
    if (!newState.bookmark) newState.bookmark = [];
    newState.bookmark = newState.bookmark.filter((e) => e !== id);
    this.setState(newState);
  }

  getBookmarkList() {
    if (!this.state.bookmark) return [];
    return [...this.state.bookmark];
  }
  getState(): UserInfomation {
    return { ...this.state };
  }

  private setState(newState: UserInfomation): void {
    this.state = { ...newState };
  }
}
