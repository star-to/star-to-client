import { API_PATH } from "./const";

const api = {
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

  //TODO: 카카오 api 요청해서 분석해야함

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

  createReviewInfo: () => {
    return fetch(API_PATH.REVIEW_INFO, {
      method: "POST",
    });
  },
};

export default api;
