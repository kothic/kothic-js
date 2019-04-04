/*
 (c) 2013, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 http://github.com/kothic/kothic-js
*/

'use strict';

const StyleManager = require("./style/style-manager");
const Gallery = require("./style/gallery")
const Renderer = require("./renderer/renderer");

/**
 ** Available options:
 ** getFrame:Function — Function, will be called prior the heavy operations
 ** debug {boolean} — render debug information
 ** browserOptimizations {boolean} — enable set of optimizations for HTML5 Canvas implementation
 **/
function Kothic(mapcss, options) {
  this.setOptions(options);

  this.styleManager = new StyleManager(mapcss, {groupFeaturesByActions: this.browserOptimizations});

  const images = mapcss.listImageReferences();
  const gallery = new Gallery(options.gallery || {});

  this.rendererPromise = gallery.preloadImages(images).then(() => {
     return new Renderer(gallery, {
      groupFeaturesByActions: this.browserOptimizations,
      debug: this.debug,
      getFrame: this.getFrame
    });
  }, (err) => console.error(err));
}

Kothic.prototype.setOptions = function(options) {
  // if (options && typeof options.devicePixelRatio !== 'undefined') {
  //     this.devicePixelRatio = options.devicePixelRatio;
  // } else {
  //     this.devicePixelRatio = 1;
  // }

  if (options && typeof options.debug !== 'undefined') {
    this.debug = !!options.debug;
  } else {
    this.debug = false;
  }

  if (options && typeof options.getFrame === 'function') {
    this.getFrame = options.getFrame;
  } else {
    if (typeof window !== "undefined") {
      this.getFrame = function (fn) {
        var reqFrame = window.requestAnimationFrame ||
              window.mozRequestAnimationFrame ||
              window.webkitRequestAnimationFrame ||
              window.msRequestAnimationFrame;

        reqFrame.call(window, fn);
      }
    } else {
      this.getFrame = function(callback) {
        setTimeout(callback, 0);
      }
    }
  }

  if (options && typeof options.browserOptimizations !== 'undefined') {
    this.browserOptimizations = !!options.browserOptimizations;
  } else {
    this.browserOptimizations = false;
  }
};

Kothic.prototype.render = function (canvas, geojson, zoom, callback) {
  // if (typeof canvas === 'string') {
  // TODO: Avoid document
  //     canvas = document.getElementById(canvas);
  // }
  // TODO: Consider moving this logic outside
  // var devicePixelRatio = 1; //Math.max(this.devicePixelRatio || 1, 2);

  const width = canvas.width;
  const height = canvas.height;

  // if (devicePixelRatio !== 1) {
  //     canvas.style.width = width + 'px';
  //     canvas.style.height = height + 'px';
  //     canvas.width = canvas.width * devicePixelRatio;
  //     canvas.height = canvas.height * devicePixelRatio;
  // }

  var ctx = canvas.getContext('2d');

  //TODO: move to options node-canvas specific setting
  ctx.globalCompositeOperation = 'copy'

  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, width, height);

  // ctx.scale(devicePixelRatio, devicePixelRatio);

  // var granularity = data.granularity,
  //     ws = width / granularity, hs = height / granularity;

  const bbox = geojson.bbox;
  const hscale = width / (bbox[2] - bbox[0]);
  const vscale = height / (bbox[3] - bbox[1]);
  function project(point) {
    return [
      (point[0] - bbox[0]) * hscale,
      (point[1] - bbox[1]) * vscale
    ];
  }

  console.time('styles');

  // setup layer styles
  // Layer is an array of objects, already sorted
  const layers = this.styleManager.createLayers(geojson.features, zoom);

  console.timeEnd('styles');

  this.rendererPromise.then((renderer) => {
    renderer.render(layers, ctx, width, height, project, callback);
  })
};

module.exports = Kothic;
