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

export interface ReviewPlaceLocation {
  x: string | null;
  y: string | null;
}

export interface ReviewPlaceInfo extends ReviewPlaceLocation {
  id: string;
}

export default class ReviewInfo {
  action: Action;
  userReview: UserReview;
  mainPlaceLocation: ReviewPlaceLocation;
  placeList: KakaoSearchedPlace[];
  detailContents: DetailContent[];
  mainPlaceId: string;

  constructor(action: Action) {
    this.action = action;
    this.userReview = {
      place_id: null,
      star: null,
      detailReviewIdList: [],
    };
    this.mainPlaceLocation = {
      x: null,
      y: null,
    };
    this.placeList = [];
    this.detailContents = [];
    this.mainPlaceId = "";
  }

  init() {
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

  assignInitPlace(): string {
    //TODO:mainPlaceId return 변경하기!!
    const newList = [...this.placeList];
    newList.sort((a, b) => Number(a.distance) - Number(b.distance));

    this.setPlaceList(newList);
    this.setMainPlaceId(newList[0].id);
    this.setPlaceLocation({ x: newList[0].x, y: newList[0].y });
    return this.mainPlaceId;
  }

  changePlace({ id, x, y }: ReviewPlaceInfo) {
    this.setMainPlaceId(id);
    this.setPlaceLocation({ x, y });
  }

  saveUserReview() {
    //TODO: 예와처리 필요함
    return api.createUserReview(this.userReview);
  }

  addReveiwPlace() {
    //TODO: 예외처리 필요함 이런것들이 여기 있어도 될지 모르겠음
    api.updateReviewInfo(this.mainPlaceLocation);
  }

  getDetailContents() {
    return [...this.detailContents];
  }

  getPlaceList() {
    return [...this.placeList];
  }

  getMainPlaceId() {
    return this.mainPlaceId;
  }

  private setPlaceList(newPlaceList: KakaoSearchedPlace[]) {
    this.placeList = [...newPlaceList];
  }

  private setDetailContest(newDetailContents: DetailContent[]) {
    this.detailContents = [...newDetailContents];
  }

  private setMainPlaceId(newId: string) {
    this.mainPlaceId = newId;
  }

  private setUserReveiw(newUserReview: UserReview) {
    this.userReview = { ...newUserReview };
  }

  private setPlaceLocation(newPlaceLocation: ReviewPlaceLocation) {
    this.mainPlaceLocation = { ...newPlaceLocation };
  }
}
