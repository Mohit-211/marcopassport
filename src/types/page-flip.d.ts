/**
 * Types for the parts of page-flip (StPageFlip 2.x) the magazine reader uses.
 * The package ships its TypeScript sources but no declarations; these follow
 * node_modules/page-flip/src (Settings.ts, PageFlip.ts).
 */
declare module "page-flip" {
  export type Orientation = "portrait" | "landscape";
  export type FlippingState = "user_fold" | "fold_corner" | "flipping" | "read";
  export type FlipCorner = "top" | "bottom";

  export interface FlipSetting {
    startPage: number;
    size: "fixed" | "stretch";
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export interface WidgetEvent<T> {
    data: T;
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<FlipSetting>);
    loadFromHTML(items: HTMLElement[]): void;
    destroy(): void;
    update(): void;
    flipNext(corner?: FlipCorner): void;
    flipPrev(corner?: FlipCorner): void;
    flip(page: number, corner?: FlipCorner): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): Orientation;
    /** The renderer; its update() re-measures the book, as a window resize does. */
    getRender(): { update(): void };
    on(event: "flip", callback: (e: WidgetEvent<number>) => void): PageFlip;
    on(event: "changeOrientation", callback: (e: WidgetEvent<Orientation>) => void): PageFlip;
    on(event: "changeState", callback: (e: WidgetEvent<FlippingState>) => void): PageFlip;
    on(event: "init" | "update", callback: (e: WidgetEvent<{ page: number; mode: Orientation }>) => void): PageFlip;
  }
}
