import Action from "../state/action";
import api from "../../api";
import { ACTION } from "../../const";
import { ReviewPlaceLocation } from "../state/review-info";
import MapInfo from "../state/map-info";

export interface SeletedPlaceInfo extends KakaoSearchedPlace {
  star_avg: number;
  review_count: number;
  contentReviewCountList: { [key: string]: number };
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

type PositionCallbackFunction = (options: KakaoMapOption) => void;

type SearchCallbackFunction = (data: KakaoSearchedPlace[]) => void;

export default class MyMap {
  action: Action;
  mapInfo: MapInfo;
  options: KakaoMapOption;
  map: KakaoMap | null;
  place: KakaoPlaces;
  geocoder: KakaoGeocoder;
  //TODO: 다른데 사용할 수 있도록 고민해보기
  infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
  categoryCodes = ["FD6", "CE7"];
  polyLine: kakaoPolyLine;
  geolocationId: number;

  constructor(action: Action, mapInfo: MapInfo) {
    this.action = action;
    this.mapInfo = mapInfo;
    this.options = {
      center: null,
      level: 3,
    };
    this.map = null;
    this.place = new kakao.maps.services.Places();
    this.geocoder = new kakao.maps.services.Geocoder();
    this.polyLine = new kakao.maps.Polyline({ path: [], strokeOpacity: 0 });
    this.geolocationId = -1;
  }

  init(): void {
    this.action.createObservers(ACTION.LOAD_PLACE_LIST);
    const initPositionCallback = (options: KakaoMapOption) => {
      if (!options.center) return;

      this.geolocationId = this.startWatchPosition();
      let cnt = 0;

      const initKeywordSearch = (placeList: KakaoSearchedPlace[]) => {
        //TODO: api 요청 실패 했을 경우 예외처리 필요함
        api.createPlaceInfo(placeList);
        this.mapInfo.addArroundPlaceList(placeList);

        cnt++;

        if (cnt === 2) {
          const allPlaceList = this.mapInfo.getArroundPlaceList();
          this.action.notify(ACTION.LOAD_PLACE_LIST, allPlaceList);
        }
      };

      const categoryOption = {
        radius: 20,
        location: options.center as KakaoLatLng,
      };

      const response = api.readReviewInfo();
      response
        .then((res) => res.json())
        .then(({ result }) => {
          //TODO:review info 정보가 있을 경우와 없을 경우로 나누어서 구현!!

          if (result.reviewedList.length === 0) {
            this.searchCategory(categoryOption, initKeywordSearch);
            return;
          }

          result.reviewedList.forEach((placeLocation: ReviewPlaceLocation) => {
            //TODO: 정확도 떨어질수도 있음 고민해보기!!
            const reviewedX = placeLocation.x?.match(/^[\d\\.]{4,7}/g) || null;
            const reviewedY = placeLocation.y?.match(/^[\d\\.]{3,6}/g) || null;

            const currentX =
              String(options.center?.getLng()).match(/^[\d\\.]{4,7}/g) || null;
            const currentY =
              String(options.center?.getLat()).match(/^[\d\\.]{3,6}/g) || null;

            if (
              reviewedX === null ||
              reviewedY === null ||
              currentX === null ||
              currentY === null
            )
              return;

            if (reviewedX[0] === currentX[0] && reviewedY[0] === currentY[0]) {
              this.mapInfo.initArroundPlaceList();
              this.action.notify(ACTION.LOAD_PLACE_LIST, []);
              return;
            }
          });

          this.searchCategory(categoryOption, initKeywordSearch);
        });
    };

    this.findCurrentPosition(initPositionCallback);
  }

  createMap(mapLayout: Node): void {
    if (!this.options.center)
      throw "ERROR:(Map) options 멤버변수가 비어있습니다.";

    const map = new kakao.maps.Map(mapLayout, this.options);
    this.setMap(map);
    map.setMaxLevel(3);
    this.searchAroundPlace();

    const placeList = this.mapInfo.getArroundPlaceList();
    if (placeList.length !== 0 && placeList !== null) {
      placeList.forEach((place: KakaoSearchedPlace) => {
        this.createMarker(place);
      });
    }

    kakao.maps.event.addListener(map, "dragend", () => {
      const currentMap = this.getMap();
      const newCenter = currentMap.getCenter();
      this.moveMapCenter(newCenter);
      this.searchAroundPlace();
    });
  }

  moveMapCenter(newCenter: KakaoLatLng): void {
    if (!this.map) throw "ERROR:(Map) map 객체가 비어있습니다.";
    const newMap = this.getMap();
    newMap.setCenter(newCenter);
    this.setMap(newMap);
  }

  createMarker(place: KakaoSearchedPlace): void {
    const markerLatLng = new kakao.maps.LatLng(
      Number(place.y),
      Number(place.x)
    );
    const marker = new kakao.maps.Marker({
      map: this.map as KakaoMap,
      position: markerLatLng,
    });

    kakao.maps.event.addListener(marker, "click", () => {
      api
        .readPlaceInfo(place.id)
        .then((res) => res.json())
        .then((placeInfo) => {
          const joinPlaceInfo = { ...placeInfo, ...place };
          if (!this.options.center) return;

          this.setPolylinePath([this.options.center, markerLatLng]);
          joinPlaceInfo.distance = this.getPolyLineLength();

          this.action.notify(
            ACTION.SELECT_PLACE_MARKER,
            joinPlaceInfo as SeletedPlaceInfo
          );

          this.infowindow.setContent(
            `<div style="padding:7px;font-size:12px;"> ${place.place_name}  </div>`
          );
          this.infowindow.open(this.map as KakaoMap, marker);
        });
    });
  }

  moveCurrentPosition(): void {
    const currentPosition = this.mapInfo.getCurrentPosition();
    if (!currentPosition) return;
    const { x, y } = currentPosition;
    const center = new kakao.maps.LatLng(Number(x), Number(y));
    this.moveMapCenter(center);
  }

  moveToSearchedPlace(keyword: string): void {
    this.stopWatchPosition();
    const keywordSearchCallback = (results: KakaoSearchedPlace[]): void => {
      //TODO:status 체크하는 코드 추가하기
      if (results.length === 0) return;
      const x = parseFloat(results[0].x);
      const y = parseFloat(results[0].y);
      const newCenter = new kakao.maps.LatLng(y, x);
      this.mapInfo.modifyCenterPosition(y, x);
      this.mapInfo.initArroundPlaceList();
      this.moveMapCenter(newCenter);
      this.searchAroundPlace();
    };

    this.searchKeyword(keyword, keywordSearchCallback);
  }

  searchKeyword(
    keyword: string,
    callback: SearchCallbackFunction,
    options?: kakaoKeywordOption
  ): void {
    this.place.keywordSearch(
      keyword,
      (data: KakaoSearchedPlace[], status: KakaoContantStatus) => {
        //TODO:멤버변수에 저장하거나 set 함수 호출하는 코드 추가
        callback(data);
      },
      options
    );
  }

  searchCategory(
    options: kakaoCategoryOption,
    callback: SearchCallbackFunction
  ): void {
    this.categoryCodes.forEach((code) => {
      this.place.categorySearch(
        code,
        (data: KakaoSearchedPlace[], status: KakaoContantStatus) => {
          //TODO:멤버변수에 저장하거나 set 함수 호출하는 코드 추가
          callback(data);
        },
        options
      );
    });
  }

  getOptions(): KakaoMapOption {
    return { ...this.options };
  }

  private searchAroundPlace(): void {
    const currentMap = this.getMap();
    this.setPlaceMap(currentMap);

    const categorySearchCallback = (searchedPlace: KakaoSearchedPlace[]) => {
      if (searchedPlace.length === 0) return;
      api
        .createPlaceInfo(searchedPlace)
        .then((res) => res.json())
        .then(({ result }) => {
          const registeredPlaceList = this.mapInfo
            .getArroundPlaceList()
            .map((e) => e.id)
            .sort((a, b) => Number(a) - Number(b));

          const newPlaceList = [];

          for (let i = 0; i < searchedPlace.length; i++) {
            const isExist = this.binarySearch(
              registeredPlaceList,
              searchedPlace[i].id
            );

            if (isExist !== -1) continue;

            newPlaceList.push(searchedPlace[i]);
            this.createMarker(searchedPlace[i]);
          }

          this.mapInfo.addArroundPlaceList(newPlaceList);
        });
    };

    this.searchCategory({ useMapBounds: true }, categorySearchCallback);
  }

  private findCurrentPosition = (callback?: PositionCallbackFunction): void => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const newOptions = this.getOptions();
        newOptions.center = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.setOptions(newOptions);
        this.mapInfo.modifyCurrentPosition(
          position.coords.latitude,
          position.coords.longitude
        );
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

  private startWatchPosition(callback?: PositionCallbackFunction): number {
    return navigator.geolocation.watchPosition(
      (position: GeolocationPosition) => {
        this.mapInfo.modifyCurrentPosition(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      (error) => {
        //TODO: 에러처리 필요함
        alert(JSON.stringify(error));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  }

  private stopWatchPosition(): void {
    navigator.geolocation.clearWatch(this.geolocationId);
  }

  private binarySearch<T>(list: T[], value: T): T | -1 {
    let lPivot = 0;
    let rPivot = list.length - 1;
    let mid = Math.floor((lPivot + rPivot) / 2);

    while (lPivot <= rPivot) {
      if (list[mid] === value) return list[mid];
      else if (Number(list[mid]) > Number(value)) {
        rPivot = mid - 1;
      } else {
        lPivot = mid + 1;
      }

      mid = Math.floor((lPivot + rPivot) / 2);
    }

    return -1;
  }

  private getPolyLineLength(): number {
    return this.polyLine.getLength();
  }

  private getMap(): KakaoMap {
    if (!this.map) throw "ERROR:(Map) map 객체가 비어있습니다.";
    return this.map;
  }

  private setOptions(newOptions: KakaoMapOption): void {
    this.options = newOptions;
  }

  private setMap(newMap: KakaoMap): void {
    this.map = newMap;
  }

  private setPlaceMap(newMap: KakaoMap | null): void {
    this.place.setMap(newMap);
  }

  private setPolylinePath(newPolyLinePath: KakaoLatLng[]) {
    this.polyLine.setPath(newPolyLinePath);
  }
}
