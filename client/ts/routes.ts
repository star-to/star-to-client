import Loading from "./component/main/loading";

type component = Loading;

interface componentFunction {
  (): component;
}

interface pages {
  [propName: string]: componentFunction;
}

interface route {
  main: pages;
}

const routes = {
  main: {
    loading: () => new Loading(),
  },
};

export { route, routes };
