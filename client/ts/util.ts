const util = {
  fetchChecedkLogin: () => {
    return fetch("/api/login/check", {
      // return fetch("http://localhost:9000/api/login/check", {
      method: "GET",
    });
  },
  fetchNaverLogin: () => {
    return fetch("/api/login/naver", {
      method: "GET",
    });
  },
};

export default util;
