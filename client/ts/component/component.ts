export interface Component {
  getHtml(): string;
  subscribeEvent?(): void;
}
