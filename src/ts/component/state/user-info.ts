import Action from "./action";
import api from "../../api";
import { State } from "../observable";
import { ACTION, IMG } from "../../const";

export type UserInfomation = {
  bookmark?: BookmarkPlaceInfo[];
  review?: State[];
};

export type BookmarkPlaceInfo = {
  place_id: string;
  place_name: string;
  position_x: string;
  position_y: string;
  star_average: number;
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

  addBookmark(placeInfo: BookmarkPlaceInfo) {
    const newState = this.getState();
    newState.bookmark?.push(placeInfo);
    this.setState(newState);
  }

  deleteBookmark(id: string) {
    //TODO: 실질적인 db 데이터를 조회한 것은 아니라서 이렇게 해도 될지 고민
    const newState = this.getState();
    if (!newState.bookmark) newState.bookmark = [];
    newState.bookmark = newState.bookmark.filter((e) => e.place_id !== id);
    this.setState(newState);
  }

  //TODO: 돔객체를 변경하기 때문에 여기 있으면 안될것같음!
  toggleBookmark(
    $targetElement: HTMLImageElement,
    placeInfo: BookmarkPlaceInfo
  ): void {
    const {
      place_id: placeId,
      position_x: x,
      position_y: y,
      place_name,
      star_average: star_avg,
    } = placeInfo;

    if (!placeId) return;

    const newToggleBookmark =
      $targetElement.dataset.toggle === "true" ? false : true;

    $targetElement.dataset.toggle = `${newToggleBookmark}`;
    $targetElement.src = newToggleBookmark
      ? IMG.FILL_BOOKMARK
      : IMG.EMPTY_BOOKMARK;

    //TODO: 이 기능 분리 해야할 지 고민해보기
    if (newToggleBookmark) {
      api.createUserBookmark(placeId);
      const addPlaceInfo = {
        place_id: placeId,
        place_name: place_name ?? "",
        position_x: x ?? "",
        position_y: y ?? "",
        star_average: star_avg ?? 0,
      };
      this.addBookmark(addPlaceInfo);
    } else {
      api.deleteUserbookmark(placeId);
      this.deleteBookmark(placeId);
    }
  }

  getBookmarkList(): BookmarkPlaceInfo[] {
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
