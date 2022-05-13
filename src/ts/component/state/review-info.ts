import Action from "./action";
import api from "../../api";

export type DetailContent = {
  detail_content_id: number;
  content: string;
  pair_id: number;
};

export default class ReviewInfo {
  action: Action;
  star: number;
  placeList: KakaoSearchedPlace[];
  mainPlaceId: string | null;
  detailContents: DetailContent[];

  constructor(action: Action) {
    this.action = action;
    this.star = 0;
    this.placeList = [];
    this.mainPlaceId = null;
    this.detailContents = [];
  }

  init() {
    //TODO: 리뷰인포가 변경될 경우 userinfo의 리뷰리스트도 업데이트 해야함!!
    const response = api.fetchReviewContent();

    response
      .then((res) => res.json())
      .then(({ result }) => {
        this.setDetailContest(result);
      });
  }

  addPlaceList(newPlaceList: KakaoSearchedPlace[]) {
    this.setPlaceList(newPlaceList);
  }

  modifyStar(newStar: number) {
    //TODO: review 페이지에서 submit 버튼을 눌렀을 경우에 이 함수를 호출하도록 구현
    this.setStar(newStar);
  }

  modifyMainPlaceId(newId: string) {
    this.setMainPlaceId(newId);
  }

  assignMainPlaceId() {
    const newList = [...this.placeList];
    newList.sort((a, b) => Number(a.distance) - Number(b.distance));
    this.setMainPlaceId(newList[0].id);
    this.setPlaceList(newList);
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

  getStar() {
    return this.star;
  }

  private setPlaceList(newPlaceList: KakaoSearchedPlace[]) {
    this.placeList = [...newPlaceList];
  }

  private setDetailContest(newDetailContents: DetailContent[]) {
    this.detailContents = [...newDetailContents];
  }

  private setStar(newStar: number) {
    this.star = newStar;
  }

  private setMainPlaceId(newId: string) {
    this.mainPlaceId = newId;
  }
}
