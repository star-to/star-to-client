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
};

export default util;
