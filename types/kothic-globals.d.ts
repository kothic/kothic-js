declare var Kothic: any;
declare var MapCSS: any;
declare var L: any;
declare var rbush: any;

interface Window {
    __kothicRenderComplete?: boolean;
    mozRequestAnimationFrame?: typeof requestAnimationFrame;
    webkitRequestAnimationFrame?: typeof requestAnimationFrame;
    msRequestAnimationFrame?: typeof requestAnimationFrame;
}
