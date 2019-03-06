/*
 (c) 2013, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 http://github.com/kothic/kothic-js
*/

var CollisionBuffer = require("./utils/collisions");
var style = require("./style/style");
var MapCSS = require("./style/mapcss");
var line = require("./renderer/line");

function Kothic(options) {
    this.setOptions(options);
}

//TODO: Document options
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

    if (options && typeof options.styles !== 'undefined') {
        this.styles = options.styles;
    } else {
        this.styles = MapCSS.availableStyles;
    }

    if (options && typeof options.getFrame === 'function') {
        this.getFrame = options.getFrame;
    } else {
        //Execute computation imediately
        this.getFrame = function(callback) {
            callback();
        };
    }
};

Kothic.prototype.render = function (canvas, data, zoom, bbox, callback) {
    // if (typeof canvas === 'string') {
    //     //TODO: Avoid document
    //     canvas = document.getElementById(canvas);
    // }

//    var styles = (options && options.styles) || [];

//    MapCSS.locales = (options && options.locales) || [];

//TODO: Consider moving this logic outside
//    var devicePixelRatio = 1; //Math.max(this.devicePixelRatio || 1, 2);

    var width = canvas.width,
    height = canvas.height;

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

    const hscale = width / (bbox[2] - bbox[0]);
    const vscale = height / (bbox[3] - bbox[1]);
    function project(point) {
      const p = [
        (point[0] - bbox[0]) * hscale,
        (point[1] - bbox[1]) * vscale
      ]

      // console.log(p);
      // exit;
      //
      return p;
    }
    console.time('styles');



    // setup layer styles
    var layers = style.populateLayers(data.features, zoom, this.styles),
        layerIds = getLayerIds(layers);

    // render the map
    style.setStyles(ctx, style.defaultCanvasStyles);

    console.timeEnd('styles');

    self = this;
    this.getFrame(function () {
        console.time('geometry');

        renderBackground(ctx, width, height, zoom, self.styles);
        renderGeometryFeatures(layerIds, layers, ctx, project, width, height);

        console.timeEnd('geometry');

        if (callback && typeof(callback) === 'function') {
            callback();
        }

        self.getFrame(function () {
            console.time('text/icons');
            renderTextAndIcons(layerIds, layers, ctx, project, collisionBuffer);
            console.timeEnd('text/icons');

            //TODO: Uncomment and add option
            //Kothic.renderCollisions(ctx, collisionBuffer.buffer.data);
        });
    });
};

function renderCollisions(ctx, node) {
    var i, len, a;

    if (node.leaf) {
        for (i = 0, len = node.children.length; i < len; i++) {
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1;
            a = node.children[i];
            ctx.strokeRect(Math.round(a[0]), Math.round(a[1]), Math.round(a[2] - a[0]), Math.round(a[3] - a[1]));
        }
    } else {
        for (i = 0, len = node.children.length; i < len; i++) {
            renderCollisions(ctx, node.children[i]);
        }
    }
}

function getLayerIds(layers) {
    return Object.keys(layers).sort(function (a, b) {
        return parseInt(a, 10) - parseInt(b, 10);
    });
}

    //TODO: Extract to browser
    // getFrame: function (fn) {
    //     var reqFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
    //                    window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    //
    //     reqFrame.call(window, fn);
    // },

function renderBackground(ctx, width, height, zoom, styles) {
    var style = MapCSS.restyle(styles, {}, {}, zoom, 'canvas', 'canvas');

    var fillRect = function () {
        ctx.fillRect(-1, -1, width + 1, height + 1);
    };

    for (var i in style) {
        Kothic.polygon.fill(ctx, style[i], fillRect);
    }
}

function renderGeometryFeatures(layerIds, layers, ctx, projectPointFunction, tile_width, tile_height) {
    var layersToRender = {},
        i, j, len, features, style, queue, bgQueue;

    for (i = 0; i < layerIds.length; i++) {
        features = layers[layerIds[i]];

        bgQueue = layersToRender._bg = layersToRender._bg || {};
        queue = layersToRender[layerIds[i]] = layersToRender[layerIds[i]] || {};

        for (j = 0, len = features.length; j < len; j++) {
            style = features[j].style;

            if ('fill-color' in style || 'fill-image' in style) {
                if (style['fill-position'] === 'background') {
                    bgQueue.polygons = bgQueue.polygons || [];
                    bgQueue.polygons.push(features[j]);
                } else {
                    queue.polygons = queue.polygons || [];
                    queue.polygons.push(features[j]);
                }
            }

            if ('casing-width' in style) {
                queue.casings = queue.casings || [];
                queue.casings.push(features[j]);
            }

            if ('width' in style) {
                queue.lines = queue.lines || [];
                queue.lines.push(features[j]);
            }
        }
    }

    layerIds = ['_bg'].concat(layerIds);

    for (i = 0; i < layerIds.length; i++) {
        queue = layersToRender[layerIds[i]];
        if (!queue)
            continue;

        if (queue.polygons) {
            for (j = 0, len = queue.polygons.length; j < len; j++) {
                Kothic.polygon.render(ctx, queue.polygons[j], queue.polygons[j + 1], projectPointFunction, tile_width, tile_height);
            }
        }

        if (queue.casings) {
            ctx.lineCap = 'butt';
            for (j = 0, len = queue.casings.length; j < len; j++) {
                line.renderCasing(ctx, queue.casings[j], queue.casings[j + 1], projectPointFunction, tile_width, tile_height);
            }
        }

        if (queue.lines) {
            ctx.lineCap = 'round';
            for (j = 0, len = queue.lines.length; j < len; j++) {
                line.render(ctx, queue.lines[j], queue.lines[j + 1], projectPointFunction, tile_width, tile_height);
            }
        }
    }
}

function renderTextAndIcons(layerIds, layers, ctx, ws, hs, collisionBuffer) {
    //TODO: Move to the features detector
    var j, style, i, passes = [];

    for (i = 0; i < layerIds.length; i++) {
        var features = layers[layerIds[i]],
            featuresLen = features.length;

        // render icons without text
        for (j = featuresLen - 1; j >= 0; j--) {
            style = features[j].style;
            if (style.hasOwnProperty('icon-image') && !style.text) {
                Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, false, true);
            }
        }

        // render text on features without icons
        for (j = featuresLen - 1; j >= 0; j--) {
            style = features[j].style;
            if (!style.hasOwnProperty('icon-image') && style.text) {
                Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, true, false);
            }
        }

        // for features with both icon and text, render both or neither
        for (j = featuresLen - 1; j >= 0; j--) {
            style = features[j].style;
            if (style.hasOwnProperty('icon-image') && style.text) {
                Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, true, true);
            }
        }

        // render shields with text
        for (j = featuresLen - 1; j >= 0; j--) {
            style = features[j].style;
            if (style['shield-text']) {
                Kothic.shields.render(ctx, features[j], collisionBuffer, ws, hs);
            }
        }
    }

    return passes;
}

module.exports = Kothic;
