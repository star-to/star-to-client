import Action from "./action";
import api from "../../api";
import { ACTION } from "../../const";

export type DetailContent = {
  detail_content_id: number;
  content: string;
  pair_id: number;
};

export type UserReview = {
  place_id: string | null;
  star: number | null;
  detailReviewIdList: string[];
};

export default class ReviewInfo {
  action: Action;
  userReview: UserReview;
  placeList: KakaoSearchedPlace[];
  detailContents: DetailContent[];

  constructor(action: Action) {
    this.action = action;
    this.userReview = {
      place_id: null,
      star: null,
      detailReviewIdList: [],
    };
    this.placeList = [];
    this.detailContents = [];
  }

  init() {
    //TODO: 리뷰인포가 변경될 경우 userinfo의 리뷰리스트도 업데이트 해야함!!
    this.action.subscribe(
      ACTION.LOAD_PLACE_LIST,
      (newPlaceList: KakaoSearchedPlace[]) => {
        this.setPlaceList(newPlaceList);
      }
    );

    const response = api.readReviewContent();

    response
      .then((res) => res.json())
      .then(({ result }) => {
        this.setDetailContest(result);
      });
  }

  addPlaceList(newPlaceList: KakaoSearchedPlace[]) {
    this.setPlaceList(newPlaceList);
  }

  assignStarScore(newStar: number) {
    const newUserReview = { ...this.userReview };
    newUserReview.star = newStar;

    this.setUserReveiw(newUserReview);
  }

  assignDetailReview(newDetail: string[]) {
    const newUserReview = { ...this.userReview };
    newUserReview.detailReviewIdList = [...newDetail];

    this.setUserReveiw(newUserReview);
  }

  assignPlaceId(newId: string) {
    const newUserReview = { ...this.userReview };
    newUserReview.place_id = newId;

    this.setUserReveiw(newUserReview);
  }

  assignMainPlaceId(): string {
    const newList = [...this.placeList];
    newList.sort((a, b) => Number(a.distance) - Number(b.distance));
    this.setPlaceList(newList);
    window.localStorage.setItem("mainPlaceId", newList[0].id);

    return newList[0].id;
  }

  saveUserReview() {
    //TODO: 예와처리 필요함
    return api.createUserReview(this.userReview);
  }

  getDetailContents() {
    return [...this.detailContents];
  }

  getPlaceList() {
    return [...this.placeList];
  }

  private setPlaceList(newPlaceList: KakaoSearchedPlace[]) {
    this.placeList = [...newPlaceList];
  }

  private setDetailContest(newDetailContents: DetailContent[]) {
    this.detailContents = [...newDetailContents];
  }

  private setUserReveiw(newUserReview: UserReview) {
    this.userReview = { ...newUserReview };
  }
}
