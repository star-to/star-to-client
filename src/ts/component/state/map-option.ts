import Action from "./action";
import { ACTION } from "../../const";

export default class MapOption {
  options: Option;
  prePosition = { latitude: 0, longitude: 0 };
  action: Action;

  constructor(action: Action) {
    this.action = action;
    this.options = {
      center: null,
      level: 3,
    };
  }

  init = (): void => {
    this.action.createObservers(ACTION.UPDATE_MAP_OPTION);
    this.action.createObservers(ACTION.START_MAP);
    this.action.subscribe(ACTION.START_MAP, this.getCurrentPosition);
  };

  getCurrentPosition = (): void => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        this.options.center = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        this.prePosition.latitude = position.coords.latitude;
        this.prePosition.longitude = position.coords.longitude;
        this.action.notify(ACTION.UPDATE_MAP_OPTION, this.options);
      },
      (error) => {
        //TODO: 에러처리 필요함
      },
      { enableHighAccuracy: true, maximumAge: 0 }
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
