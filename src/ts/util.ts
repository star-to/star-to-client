const util = {
  fetchChecedkLogin: () => {
    return fetch("/api/login/check", {
      method: "GET",
    });
  },
  fetchNaverLogin: () => {
    return fetch("/api/login/naver", {
      method: "GET",
    });
  },

  fetchKakaoLogin: () => {
    return fetch("/api/login/kakao", {
      method: "GET",
    });
  },

  //TODO: 카카오 api 요청해서 분석해야함

  fetchClientReview: () => {
    return fetch("/api/my-review", {
      method: "GET",
    });
  },
};

export default util;
