import Action from "./action";
import { ACTION } from "../../const";

export default class MapOption {
  options: KakaoMapOption;
  action: Action;

  constructor(action: Action) {
    this.action = action;
    this.options = {
      center: null,
      level: 3,
    };
  }

  init(): void {
    //TODO:맵 액션들 정리할 필요 있음!!
    this.action.createObservers(ACTION.START_MAP);
    this.action.createObservers(ACTION.UPDATE_MAP_OPTION);
  }

  findCurrentPosition = (isInit: boolean): void => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const newOptions = this.getOptions();
        newOptions.center = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        this.setOptions(newOptions);
        if (isInit) {
          this.action.notify(ACTION.START_MAP, newOptions);
        } else {
          this.action.notify(ACTION.UPDATE_MAP_OPTION, newOptions);
        }
      },
      (error) => {
        //TODO: 에러처리 필요함
        alert(JSON.stringify(error));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  watchPosition = (): void => {
    const id = navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        if (!this.options.center) return;

        const currentCoords = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        const isMove = currentCoords.equals(this.options.center);

        if (!isMove) {
          navigator.geolocation.clearWatch(id);
          return;
        }

        this.options.center = currentCoords;
        this.action.notify(ACTION.UPDATE_MAP_OPTION, this.options);
      },
      (error) => {
        //TODO: 에러처리 필요함
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  getOptions(): KakaoMapOption {
    return { ...this.options };
  }

  setOptions(newOptions: KakaoMapOption): void {
    this.options = { ...newOptions };
  }
}

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

interface GeolocationCoordinates {
  accuracy: number;
  latitude: number;
  longitude: number;
}
