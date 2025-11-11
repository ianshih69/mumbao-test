// types/third-party.d.ts

// owl.carousel 沒有官方型別，宣告給 TS 避免報錯
declare module "owl.carousel";

// 把 jQuery 掛到 window 的型別（我們在 useEffect 會賦值）
interface Window {
  jQuery: JQueryStatic;
  $: JQueryStatic;
}
