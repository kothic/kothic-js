/*
 (c) 2013, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 http://github.com/kothic/kothic-js
*/

'use strict';

var CollisionBuffer = require("./utils/collisions");
const canvasContext = require("./utils/style");
var mapcss = require("mapcss");
var StyleManager = require("./style/style-manager");
var renderer = require("./renderer/renderer");

function Kothic(options) {
    this.setOptions(options);
}

//TODO: Document options
/**
 ** Available options:
 ** css:String — MapCSS style. If css is not specified, default style
 **              will be applied and you won't like it.
 ** locales:Array — List or locales for rendering texts
 ** getFrame:Function — Function, will be called prior the heavy operations
 ** debug:Boolean — render debug information
 **/
Kothic.prototype.setOptions = function(options) {
  // if (options && typeof options.devicePixelRatio !== 'undefined') {
  //     this.devicePixelRatio = options.devicePixelRatio;
  // } else {
  //     this.devicePixelRatio = 1;
  // }

  if (options && typeof options.locales !== 'undefined') {
    this.locales = options.locales;
  } else {
    this.locales = [];
  }

  if (options && typeof options.debug !== 'undefined') {
    this.debug = !!options.debug;
  } else {
    this.debug = false;
  }

  if (options && typeof options.css !== 'undefined') {
    const ast = mapcss.parse(options.css);
    this.styleManager = new StyleManager(ast, this.locales);
  } else {
    //TODO: Create more complex default style and save it to separate file
    const ast = mapcss.parse("way { width: 1; color: black;}");
    this.styleManager = new StyleManager(ast, this.locales);
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
};

Kothic.prototype.render = function (canvas, geojson, zoom, callback) {
    // if (typeof canvas === 'string') {
    //     //TODO: Avoid document
    //     canvas = document.getElementById(canvas);
    // }

//    var styles = (options && options.styles) || [];

//    MapCSS.locales = (options && options.locales) || [];

//TODO: Consider moving this logic outside
//    var devicePixelRatio = 1; //Math.max(this.devicePixelRatio || 1, 2);

    const width = canvas.width;
    const height = canvas.height;

    // if (devicePixelRatio !== 1) {
    //     canvas.style.width = width + 'px';
    //     canvas.style.height = height + 'px';
    //     canvas.width = canvas.width * devicePixelRatio;
    //     canvas.height = canvas.height * devicePixelRatio;
    // }

    var ctx = canvas.getContext('2d');
//    ctx.scale(devicePixelRatio, devicePixelRatio);

    // var granularity = data.granularity,
    //     ws = width / granularity, hs = height / granularity;
    var collisionBuffer = new CollisionBuffer(height, width);


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

    // render the map
    canvasContext.applyDefaults(ctx);

    console.timeEnd('styles');
    const self = this;
    this.getFrame(function () {
        console.time('geometry');

        renderer.renderBackground(layers, ctx, width, height, zoom);
        renderer.renderGeometryFeatures(layers, ctx, project, width, height);

        console.timeEnd('geometry');

        if (callback && typeof(callback) === 'function') {
            callback();
        }

        self.getFrame(function () {
            console.time('text/icons');
            renderer.renderTextAndIcons(layers, ctx, project, collisionBuffer);
            console.timeEnd('text/icons');

            if (self.debug) {
              renderer.renderCollisions(ctx, collisionBuffer.buffer.data);
            }
        });
    });
};

module.exports = Kothic;
