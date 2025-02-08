import { ReviewPlaceLocation, UserReview } from "@component/state/review-info";

import { API_PATH } from "@/ts/const";

const api = {
  //TODO:로그아웃, 로그인 서버를 별도로 둬야할까?
  readCheckedLogin: () => {
    return fetch(API_PATH.LOGIN_CHECK, {
      method: "GET",
    });
  },

  //TODO: get 요청이 맞을지 검토 필요함!!
  fetchNaverLogin: () => {
    return fetch(API_PATH.LOGIN_NAVER, {
      method: "GET",
    });
  },

  fetchKakaoLogin: () => {
    return fetch(API_PATH.LOGIN_KAKAO, {
      method: "GET",
    });
  },

  fetchLogout: () => {
    return fetch(API_PATH.LOGOUT, {
      method: "GET",
    });
  },

  readClientReview: () => {
    return fetch(API_PATH.MY_REVIEW, {
      method: "GET",
    });
  },

  createPlaceInfo: (data: KakaoSearchedPlace[]) => {
    return fetch(API_PATH.PLACE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  readPlaceInfo: (id: string) => {
    return fetch(API_PATH.PLACE + `/${id}`, {
      method: "GET",
    });
  },

  createUserBookmark: (placeId: string) => {
    return fetch(API_PATH.BOOKMARK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ placeId }),
    });
  },

  deleteUserbookmark: (placeId: string) => {
    return fetch(API_PATH.BOOKMARK + `/${placeId}`, {
      method: "DELETE",
    });
  },

  readUserBookmark: () => {
    return fetch(API_PATH.BOOKMARK, {
      method: "GET",
    });
  },

  readReviewContent: () => {
    return fetch(API_PATH.REVEIW_CONTENT, {
      method: "GET",
    });
  },

  readReviewInfo: () => {
    return fetch(API_PATH.REVIEW_INFO, {
      method: "GET",
    });
  },

  createReviewInfo: () => {
    return fetch(API_PATH.REVIEW_INFO, {
      method: "POST",
    });
  },

  updateReviewInfo: (data: ReviewPlaceLocation) => {
    //TODO: 요청 url을 변경할 필요 있음 /place_id 등으로
    return fetch(API_PATH.REVIEW_INFO, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  createUserReview: (data: UserReview) => {
    //TODO: 장소 id를 url로 넘겨주는 것도 고민해보기!
    return fetch(API_PATH.USER_REVIEW, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};

export default api;
