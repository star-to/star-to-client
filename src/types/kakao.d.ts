declare namespace kakao {
  namespace maps {
    class Map {
      constructor(container: Node, options: MapOption);
      setCenter(latlng: LatLng): void;
      getCenter(): LatLng;
    }

    interface MapOption {
      center: LatLng | null;
      level?: number;
      mapTypeId?: MapTypeId;
      draggable?: boolean;
      scrollwheel?: boolean;
      disableDoubleClick?: boolean;
      disableDoubleClickZoom?: boolean;
      projectionId?: string;
      tileAnimatio?: boolean;
      keyboardShortcuts?: boolean | object;
    }

    type MapTypeId =
      | "ROADMAP"
      | "SKYVIEW"
      | "HYBRID"
      | "ROADVIEW"
      | "OVERLAY"
      | "TRAFFIC"
      | "TERRAIN"
      | "BICYCLE"
      | "BICYCLE_HYBRID"
      | "USE_DISTRICT";

    class LatLng {
      constructor(latitude: number, logitude: number);
      equals(compareInstance: LatLng): boolean;
    }

    namespace services {
      class Places {
        constructor(map: Map);
        categorySearch(
          code: string,
          callback: (data: SearchedPlace[], status: ConstantStatus) => void,
          options: CategoryOption
        ): void;
      }

      interface SearchedPlace {
        place_name: string;
        category_name: string;
        category_group_code: string;
        category_group_name: string;
        phone: string;
        address_name: string;
        road_address_name: string;
        x: string;
        y: string;
        place_url: string;
        distance: string;
      }

      interface CategoryOption {
        location?: LatLng;
        x?: number;
        y?: number;
        radius?: number;
        bounds?: LatLngBounds;
        rect?: string;
        size?: number;
        page?: number;
        sort?: SortBy;
        useMapCenter?: boolean;
        useMapBounds?: boolean;
      }

      type SortBy = "DISTANCE" | "ACCURACY";

      type ConstantStatus = "OK" | "ZERO_RESULT" | "ERROR";

      namespace Status {
        const OK: "OK";
        const ZERO_RESULT: "ZERO_RESULT";
        const ERROR: "ERROR";
      }
    }

    class LatLngBounds {
      constructor(sw: LatLng, ne: LatLng);
    }

    namespace event {
      function addListener(
        map: Map | Marker,
        eventName: EventName,
        callback: (event?: MouseEvent) => void
      ): void;

      type EventName =
        | "center_changed"
        | "zoom_start"
        | "zoom_changed"
        | "bounds_changed"
        | "click"
        | "dblclick"
        | "mousemove"
        | "dragstart"
        | "drag"
        | "dragend";
    }

    class Marker {
      constructor(options: MarkerOption);
    }

    interface MarkerOption {
      map: Map;
      position: LatLng;
      image?: MarkerImage;
      title?: string;
      draggable?: boolean;
      clickable?: boolean;
      zIndex?: number;
      opacity?: number;
      altitude?: number;
      range?: number;
    }

    class MarkerImage {
      constructor(src: string, size: Size, options: MarkerImageOption);
    }

    interface MarkerImageOption {
      alt: string;
      coords: string;
      offset: Point;
      shape: string;
      spriteOrigin: Point;
      spriteSize: Size;
    }

    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    class InfoWindow {
      constructor(option: InfoWindowOption);
      open(map: Map, marker: Marker): void;
      setContent(content: Node | string): void;
    }

    interface InfoWindowOption {
      content?: Node | string;
      disableAutoPan?: boolean;
      map?: Map;
      position?: LatLng;
      removable?: boolean;
      zIndex?: number;
      altitude?: number;
      range?: number;
    }
  }
}

type KakaoMap = kakao.maps.Map;
type KakaoMapOption = kakao.maps.MapOption;
type KakaoLatLng = kakao.maps.LatLng;
type KakaoPlaces = kakao.maps.services.Places;
type KakaoSearchedPlace = kakao.maps.services.SearchedPlace;
type KakaoContantStatus = kakao.maps.services.ConstantStatus;
type KakaoLatLngBounds = kakao.maps.LatLngBounds;
type KakaoEventName = kakao.maps.event.EventName;
type KakaoOption =
  | kakao.maps.MapOption
  | kakao.maps.services.CategoryOption
  | kakao.maps.MarkerOption
  | kakao.maps.MarkerImageOption
  | kakao.maps.InfoWindowOption;
