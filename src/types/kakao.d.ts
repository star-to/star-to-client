// export kakao

declare namespace kakao {
  namespace maps {
    class Map {
      constructor(container: Node, options: Option);
    }

    class LatLng {
      constructor(latitude: number, logitude: number);
      equals(compareInstance: LatLng): boolean;
    }
  }
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

interface Option {
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

declare class LatLng {
  constructor(latitude: number, logitude: number);
  equals(compareInstance: LatLng): boolean;
}
