import { Component } from "./component/component";
import Loading from "./component/main/loading";

interface Pages {
  [propName: string]: () => Component;
}

interface route {
  main: Pages;
}

const routes = {
  main: {
    loading: () => new Loading(),
  },
};

export { route, routes };
