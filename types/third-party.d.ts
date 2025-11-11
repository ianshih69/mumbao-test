// types/third-party.d.ts

// ★ 同時宣告兩個可被引用的名稱
declare module "owl.carousel" {
  const value: any;
  export default value;
}
declare module "owl.carousel/dist/owl.carousel.js" {
  const value: any;
  export default value;
}

// jQuery 會掛到 window（在 useEffect 內），補上型別
interface Window {
  jQuery: JQueryStatic;
  $: JQueryStatic;
}

// 擴充 jQuery 介面：加入 owlCarousel / trigger
declare global {
  interface JQuery<TElement = HTMLElement> {
    owlCarousel(options?: any): JQuery<TElement>;
    trigger?(event: string, ...args: any[]): JQuery<TElement>;
  }
}

export {};
