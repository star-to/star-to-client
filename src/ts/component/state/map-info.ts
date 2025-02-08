import Action from "@component/state/action";

export interface MapPositon {
  x: string;
  y: string;
}

export default class MapInfo {
  action: Action;
  currentPosition: MapPositon | null;
  centerPosition: MapPositon | null;
  arroundPlaceList: KakaoSearchedPlace[];

  constructor(action: Action) {
    this.action = action;
    this.currentPosition = null;
    this.centerPosition = null;
    this.arroundPlaceList = [];
  }

  getCurrentPosition(): MapPositon | null {
    if (!this.currentPosition) return null;
    return { ...this.currentPosition };
  }

  getCenterPosition(): MapPositon | null {
    if (!this.centerPosition) return null;
    return { ...this.centerPosition };
  }

  getArroundPlaceList(): KakaoSearchedPlace[] {
    return this.arroundPlaceList.map((e) => Object.assign({}, e));
  }

  addArroundPlaceList(newMarker: KakaoSearchedPlace[]): void {
    const newMarkerList = this.getArroundPlaceList();
    newMarkerList.push(...newMarker);
    this.setArroundPlaceList(newMarkerList);
  }

  initArroundPlaceList(): void {
    this.setArroundPlaceList([]);
  }

  modifyCurrentPosition(x: number, y: number): void {
    const newPosition = { x: String(x), y: String(y) };
    this.setCurrentPosition(newPosition);
  }

  modifyCenterPosition(x: number, y: number): void {
    const newPosition = { x: String(x), y: String(y) };
    this.setCenterPosition(newPosition);
  }

  private setCurrentPosition(newPosition: MapPositon): void {
    this.currentPosition = newPosition;
  }

  private setCenterPosition(newPosition: MapPositon): void {
    this.centerPosition = newPosition;
  }

  private setArroundPlaceList(newList: KakaoSearchedPlace[]) {
    this.arroundPlaceList = newList;
  }
}
