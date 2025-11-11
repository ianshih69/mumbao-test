// /types/owl-carousel.d.ts

// 同時宣告兩個可被 import 的名稱（一般名 & 指到 dist 檔）
declare module "owl.carousel" {
  const plugin: any;
  export = plugin; // 用 export= 讓 bundler 解析更穩
}
declare module "owl.carousel/dist/owl.carousel.js" {
  const plugin: any;
  export = plugin;
}

// 我們在 useEffect 會把 jQuery 掛到 window，補上型別
interface Window {
  jQuery: JQueryStatic;
  $: JQueryStatic;
}

// 擴充 jQuery介面，讓 $().owlCarousel(...) 有型別
declare global {
  interface JQuery<TElement = HTMLElement> {
    owlCarousel(options?: any): JQuery<TElement>;
    trigger?(event: string, ...args: any[]): JQuery<TElement>;
  }
}

export {};
