import Action from "./action";

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

  init() {
    this.action.createObservers("updateMapOption");
  }

  getCurrentPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.options.center = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        // eslint-disable-next-line no-console
        console.log(this.options.center);

        this.prePosition.latitude = position.coords.latitude;
        this.prePosition.longitude = position.coords.longitude;
        this.action.notify("updateMapOption", this.options);
      },
      (error) => {
        //TODO: 에러처리 필요함
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }

  watchPosition() {
    const id = navigator.geolocation.watchPosition(
      (position) => {
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
        this.action.notify("updateMapOption", this.options);
      },
      (error) => {
        //TODO: 에러처리 필요함
      },
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }
}
