export interface Component {
  paintComponent(): void;
  subscribeEvent?(): void;
}
