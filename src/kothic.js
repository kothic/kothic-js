/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

var Kothic = {

    render: function (canvas, data, zoom, options) {
        console.time('styles');

        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }

        var styles = (options && options.styles) || [];

        MapCSS.locales = (options && options.locales) || [];

        var devicePixelRatio = Math.max(window.devicePixelRatio || 1, 2);

        var width = canvas.width,
            height = canvas.height;

        if (devicePixelRatio != 1) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.width = canvas.width * devicePixelRatio;
            canvas.height = canvas.height * devicePixelRatio;
        }

        var ctx = canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio);

        var granularity = data.granularity,
            ws = width / granularity, hs = height / granularity,
            collisionBuffer = new Kothic.CollisionBuffer(height, width);

        //Setup layer styles
        var layers = Kothic.style.populateLayers(data.features, zoom, styles);
        var layerIds = Kothic.getLayerIds(layers);

        //Render the map
        Kothic.style.setStyles(ctx, Kothic.style.defaultCanvasStyles);

        console.timeEnd('styles');
        console.time('geometry');

        Kothic._renderBackground(ctx, width, height, zoom, styles);

        Kothic.renderAsync(
            Kothic._renderGeometryFeatures(layerIds, layers, ctx, ws, hs, granularity)
            .concat([
                function () {
                    console.timeEnd('geometry');
                    console.time('text/icons');
                }
            ])
            .concat(Kothic._renderTextAndIcons(layerIds, layers, ctx, ws, hs, collisionBuffer))
            .concat([
                function () {
                    if (options && options.onRenderComplete) {
                        options.onRenderComplete();
                    }
                    console.timeEnd('text/icons');
                }
            ])
        );
    },

    getLayerIds: function (layers) {
        return Object.keys(layers).sort(function (a, b) {
            return parseInt(a) - parseInt(b);
        });
    },

    getFrame: function (fn) {
        var reqFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                       window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        reqFrame.call(window, fn);
    },

    renderAsync: function (fns) {
        var len = fns.length;

        var handler = function () {
            fns[len - 1]();
        }
        for (var i = fns.length - 2; i >= 0; i--) {
            (function (i, prevHandler) {
                handler = function () {
                    fns[i]();
                    Kothic.getFrame(prevHandler);
                }
            })(i, handler);
        }
        Kothic.getFrame(handler);
    },

    _renderBackground: function (ctx, width, height, zoom, styles) {
        var style = MapCSS.restyle(styles, {}, {}, zoom, "canvas", "canvas");

        var fillRect = function () {
            ctx.fillRect(-1, -1, width + 1, height + 1);
        };

        for (var i in style) {
            Kothic.polygon.fill(ctx, style[i], fillRect);
        }
    },

    _renderGeometryFeatures: function (layerIds, layers, ctx, ws, hs, granularity) {
        var passes = [],
            layersToRender = {},
            i, j, len, features, style, queue, bgQueue;

        // polygons
        for (i = 0; i < layerIds.length; i++) {
            features = layers[layerIds[i]];

            bgQueue = layersToRender._bg = layersToRender._bg || {};
            queue = layersToRender[layerIds[i]] = layersToRender[layerIds[i]] || {};
            queue.id = layerIds[i];

            for (j = 0, len = features.length; j < len; j++) {
                style = features[j].style;

                if ('fill-color' in style || 'fill-image' in style) {
                    if (style["fill-position"] === 'background') {
                        bgQueue.polygons = bgQueue.polygons || [];
                        bgQueue.polygons.push(features[j]);
                    } else {
                        queue.polygons = queue.polygons || [];
                        queue.polygons.push(features[j]);
                    }
                }
            }
        }

        // casings
        for (i = 0; i < layerIds.length; i++) {
            features = layers[layerIds[i]];
            queue = layersToRender[layerIds[i]] = layersToRender[layerIds[i]] || {};
            queue.id = layerIds[i];

            for (j = 0, len = features.length; j < len; j++) {

                if ('casing-width' in features[j].style) {
                    queue.casings = queue.casings || [];
                    queue.casings.push(features[j]);
                }
            }
        }

        // lines
        for (i = 0; i < layerIds.length; i++) {
            features = layers[layerIds[i]];
            queue = layersToRender[layerIds[i]] = layersToRender[layerIds[i]] || {};
            queue.id = layerIds[i];

            for (j = 0, len = features.length; j < len; j++) {

                if ('width' in features[j].style) {
                    queue.lines = queue.lines || [];
                    queue.lines.push(features[j]);
                }
            }
        }

        layerIds = ['_bg'].concat(layerIds);

        for (i = 0; i < layerIds.length; i++) {
            (function (queue) {
                var j, len;

                if (queue.polygons) {
                    passes.push(function () {
                        //ctx.clearRect(0, 0, 1000, 1000);
                        for (j = 0, len = queue.polygons.length; j < len; j++) {
                            Kothic.polygon.render(ctx, queue.polygons[j], queue.polygons[j + 1], ws, hs, granularity);
                        }
                    });
                }

                if (queue.casings || queue.lines) {
                    passes.push(function () {
                        //ctx.clearRect(0, 0, 1000, 1000);
                        if (queue.casings) {
                            ctx.lineCap = "butt";
                            for (j = 0, len = queue.casings.length; j < len; j++) {
                                Kothic.line.renderCasing(ctx, queue.casings[j], queue.casings[j + 1], ws, hs, granularity);
                            }
                        }
                        if (queue.lines) {
                            ctx.lineCap = "round";
                            for (j = 0, len = queue.lines.length; j < len; j++) {
                                Kothic.line.render(ctx, queue.lines[j], queue.lines[j + 1], ws, hs, granularity);
                            }
                        }
                    });
                }

            })(layersToRender[layerIds[i]]);
        }

        return passes;
    },

    _renderTextAndIcons: function (layerIds, layers, ctx, ws, hs, collisionBuffer) {
        //TODO: Move to the features detector
        var textOnCanvasAvailable = ctx.strokeText && ctx.fillText && ctx.measureText;
        var j, style, i,
            passes = [];

        for (i = 0; i < layerIds.length; i++) {
            (function (features) {
                var featuresLen = features.length;

                // render icons without text
                passes.push(function () {
                    for (j = featuresLen - 1; j >= 0; j--) {
                        style = features[j].style;
                        if (style.hasOwnProperty('icon-image') && !style.text) {
                            Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, false, true);
                        }
                    }
                });

                // render text on features without icons
                passes.push(function () {
                    for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
                        style = features[j].style;
                        if (!style.hasOwnProperty('icon-image') && style.text) {
                            Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, true, false);
                        }
                    }
                });

                // for features with both icon and text, render both or neither
                passes.push(function () {
                    for (j = featuresLen - 1; j >= 0; j--) {
                        style = features[j].style;
                        if (style.hasOwnProperty('icon-image') && style.text) {
                            Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, textOnCanvasAvailable, true);
                        }
                    }
                });

                // render shields with text
                passes.push(function () {
                    for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
                        style = features[j].style;
                        if (style["shield-text"]) {
                            Kothic.shields.render(ctx, features[j], collisionBuffer, ws, hs);
                        }
                    }
                });
            })(layers[layerIds[i]]);
        }

        return passes;
    }
};
