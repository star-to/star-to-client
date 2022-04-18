import Action from "../state/action";
import api from "../../api";

interface GeolocationPosition {
  coords: GeolocationCoordinates;
  timestamp: number;
}

interface GeolocationCoordinates {
  accuracy: number;
  latitude: number;
  longitude: number;
}

type positionCallbackFunction = (options: KakaoMapOption) => void;

export default class MyMap {
  action: Action;
  options: KakaoMapOption;
  map: KakaoMap | null;
  infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

  constructor(action: Action) {
    this.action = action;
    this.options = {
      center: null,
      level: 3,
    };
    this.map = null;
  }

  init() {
    this.findCurrentPosition();
  }

  createMap(mapLayout: Node) {
    if (!this.options) throw "ERROR:(Map) options 멤버변수가 비어있습니다.";

    const map = new kakao.maps.Map(mapLayout, this.options);
    this.setMap(map);

    kakao.maps.event.addListener(map, "dragend", () => {
      const currentMap = this.getMap();
      const newCenter = currentMap.getCenter();
      this.moveMapCenter(newCenter);
      this.searchAroundPlace();
    });
  }

  moveMapCenter(newCenter: KakaoLatLng) {
    if (!this.map) throw "ERROR:(Map) map 객체가 비어있습니다.";
    const newMap = this.getMap();
    newMap.setCenter(newCenter);
    this.setMap(newMap);
  }

  searchAroundPlace() {
    const currentMap = this.getMap();
    const place = new kakao.maps.services.Places(currentMap);

    const categorySearchCallback = (
      searchedPlace: KakaoSearchedPlace[],
      status: KakaoContantStatus
    ) => {
      if (status === kakao.maps.services.Status.OK) {
        api
          .fetchPlaceInfo(searchedPlace)
          .then((res) => res.json())
          .then(({ result }) => {
            //TODO: 응답이 제대로 오지 않았을 때 해야할 것들 추가!!
            for (let i = 0; i < searchedPlace.length; i++) {
              this.createMarker(searchedPlace[i]);
            }
          });
      }
    };

    place.categorySearch(
      "FD6",
      (data: KakaoSearchedPlace[], status: KakaoContantStatus) => {
        categorySearchCallback(data, status);
      },
      { useMapBounds: true }
    );

    place.categorySearch(
      "CE7",
      (data: KakaoSearchedPlace[], status: KakaoContantStatus) => {
        categorySearchCallback(data, status);
      },
      { useMapBounds: true }
    );
  }

  createMarker(place: KakaoSearchedPlace) {
    const marker = new kakao.maps.Marker({
      map: this.map as KakaoMap,
      position: new kakao.maps.LatLng(Number(place.y), Number(place.x)),
    });

    kakao.maps.event.addListener(marker, "click", () => {
      this.infowindow.setContent(
        `<div style="padding:5px;font-size:12px;"> ${place.place_name}  </div>`
      );

      this.infowindow.open(this.map as KakaoMap, marker);
    });
  }

  moveCurrentPosition() {
    this.findCurrentPosition(this.updateCenterCallback);
  }

  searchKeyword(keyword: string) {
    const place = new kakao.maps.services.Places();

    const keywordSearchCallback = (
      results: KakaoSearchedPlace[],
      status: KakaoContantStatus
    ): void => {
      //TODO:status 체크하는 코드 추가하기
      const x = parseFloat(results[0].x);
      const y = parseFloat(results[0].y);
      const newCenter = new kakao.maps.LatLng(y, x);
      this.moveMapCenter(newCenter);
      this.searchAroundPlace();
    };

    place.keywordSearch(keyword, keywordSearchCallback);
  }

  findCurrentPosition = (callback?: positionCallbackFunction): void => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const newOptions = this.getOptions();
        newOptions.center = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );

        this.setOptions(newOptions);

        if (!callback) return;
        callback(newOptions);
      },
      (error) => {
        //TODO: 에러처리 필요함
        alert(JSON.stringify(error));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  updateCenterCallback = (options: KakaoMapOption): void => {
    if (!options.center) return;
    const { center } = options;
    try {
      this.moveMapCenter(center);
      this.searchAroundPlace();
    } catch (e) {
      // TODO: 에러 객체를 만들어서 에러 타입별로 행동을 다르게 해야할 듯
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  getOptions(): KakaoMapOption {
    return { ...this.options };
  }

  private setOptions(newOptions: KakaoMapOption): void {
    this.options = newOptions;
  }

  private getMap(): KakaoMap {
    if (!this.map) throw "ERROR:(Map) map 객체가 비어있습니다.";
    return this.map;
  }

  private setMap(newMap: KakaoMap): void {
    this.map = newMap;
  }
}
