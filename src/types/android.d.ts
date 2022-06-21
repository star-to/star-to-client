interface WebAppInterface {
  copyToClipboard(text: string): void;
  checkConnecting(): boolean;
  showToast(text: string): void;
}
declare const Android: WebAppInterface;
