// TODO: 제거 검토 (제거하란말은 아님)
export default class MapOption {
  options: KakaoMapOption;
  
  // state: { a: string }
  // state: { b: string }
  
  // getState():string { return a }
  // getSTate():string { retrun b };

  constructor() {
    this.options = {
      center: null,
      level: 3,
    };
  }

  // init(): void {
  // }


  // TODO: 제거 및 대체
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
        // this.action.notify(ACTION.UPDATE_MAP_OPTION, this.options);
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
