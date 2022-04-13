import Action from "../state/action";
import { ACTION } from "../../const";
import api from "../../api";
import MapOption from "../state/map-option";

export default class MyMap {
  action: Action;
  mapOption: MapOption;
  mapLayout: Node | null;
  map: kakao.maps.Map | null;
  infoWindow = new kakao.maps.InfoWindow({ zIndex: 1 });
  // markers = [];

  constructor(action: Action, mapOption: MapOption) {
    this.action = action;
    this.mapOption = mapOption;
    this.mapLayout = null;
    this.map = null;
  }

  init(mapLayout: Node) {
    this.mapLayout = mapLayout;
    
    try {
      if (!this.mapLayout) throw "ERROR:(Map) mapLayout 객체가 비어있습니다.";

      this.map = new kakao.maps.Map(this.mapLayout, this.mapOption.getOptions());

      kakao.maps.event.addListener(this.map, "dragend", () => {
        if (!this.map) return;
  
        const newCenter = this.map.getCenter();
        const map = this.moveMapCenter(newCenter);
        this.searchAroundPlace(map);
      });
      
      this.searchAroundPlace(this.map);
      
    } catch (e) {
      // TODO: 에러 객체를 만들어서 에러 타입별로 행동을 다르게 해야할 듯
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }


  moveMapCenter(newCenter: KakaoLatLng): KakaoMap {
    if (!this.map) throw "ERROR:(Map) mapLayout 객체가 비어있습니다.";
    this.map.setCenter(newCenter);

    return this.map;
  }

  moveCurrentPosition() {
    this.syncCurrentPosition();
  }

  searchKeyword(keyword: string) {
    const place = new kakao.maps.services.Places();

    const keywordSearchCallback = (
      results: KakaoSearchedPlace[],
      status: KakaoContantStatus
    ): void => {
      // TODO: status 체크하는 코드 추가하기
      const x = parseFloat(results[0].x);
      const y = parseFloat(results[0].y);
      const newCenter = new kakao.maps.LatLng(y, x);

      const map = this.moveMapCenter(newCenter);
      this.searchAroundPlace(map);
    };

    place.keywordSearch(keyword, keywordSearchCallback);
  }
  
  private createMarker(place: KakaoSearchedPlace) {
    const marker = new kakao.maps.Marker({
      map: this.map as KakaoMap,
      position: new kakao.maps.LatLng(Number(place.y), Number(place.x)),
    });
    
    // this.markers.push(marker);
    
    kakao.maps.event.addListener(marker, "click", () => {
      // TODO: 요론거는 액션으로 만들어"도" 좋음
      
      this.infoWindow.setContent(
        `<div style="padding:5px;font-size:12px;"> ${place.place_name}  </div>`
      );
      
      this.infoWindow.open(this.map as KakaoMap, marker);
    });
  }
  
  private searchAroundPlace(map: KakaoMap) {
    const place = new kakao.maps.services.Places(map);
    
    const categorySearchCallback = (
      searchedPlace: KakaoSearchedPlace[],
      status: KakaoContantStatus
    ) => {
      // TODO: 외부로 빠지면 좋음
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
  
  
  
  private syncCurrentPosition (): void  {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const newOptions = this.mapOption.getOptions();
        newOptions.center = new kakao.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
      
        this.mapOption.setOptions(newOptions);
        this.updateCenterObserver(newOptions)
      },
      (error) => {
        //TODO: 에러처리 필요함
        alert(JSON.stringify(error));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  }
  
  private updateCenterObserver(newOptions:kakao.maps.MapOption):void{
    try {
      // const map = this.moveMapCenter(newOptions.center);
      // this.searchAroundPlace(map);
    } catch (e) {
      // TODO: 에러 객체를 만들어서 에러 타입별로 행동을 다르게 해야할 듯
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}
