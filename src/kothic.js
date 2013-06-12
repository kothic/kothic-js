/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

var Kothic = {

    render: function (canvas, data, zoom, options) {
        if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }

        var styles = (options && options.styles) || [];

        MapCSS.locales = (options && options.locales) || [];

        var devicePixelRatio = window.devicePixelRatio || 1;

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
        var layerIds = Object.keys(layers).sort();

        //Render the map
        Kothic.style.setStyles(ctx, Kothic.style.defaultCanvasStyles);

        //Kothic._renderBackground(ctx, width, height, zoom, styles);

        Kothic.renderAsync(
            Kothic._renderGeometryFeatures(layerIds, layers, ctx, ws, hs, granularity)
            .concat(Kothic._renderTextAndIcons(layerIds, layers, ctx, ws, hs, collisionBuffer))
            .concat([
                function () {
                    if (options && options.onRenderComplete) {
                        options.onRenderComplete();
                    }
                }
            ])
        );
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
        var style = MapCSS.restyle(styles, {}, {}, zoom, "canvas", "canvas"),
            style_names = Object.keys(style).sort(),
            i;

        var fillRect = function () {
            ctx.fillRect(-1, -1, width + 1, height + 1);
        };

        for (i = 0; i < style_names.length; i++) {
            Kothic.polygon.fill(ctx, style[style_names[i]], fillRect);
        }
    },

    _renderGeometryFeatures: function (layerIds, layers, ctx, ws, hs, granularity) {
        var passes = [], i;

        // render background polygons
        passes.push(function () {
            for (i = 0; i < layerIds.length; i++) {
                var features = layers[layerIds[i]];
                for (var j = 0, len = features.length; j < len; j++) {
                    var style = features[j].style;
                    if (style["fill-position"] == 'background' && (style.hasOwnProperty('fill-color') || style.hasOwnProperty('fill-image'))) {
                        Kothic.polygon.render(ctx, features[j], features[j + 1], ws, hs, granularity);
                    }
                }
            }
        });

        for (i = 0; i < layerIds.length; i++) {
            (function (features) {
                if (!features.length) { return; }

                passes.push(function () {
                    // Render polygon
                    for (var j = 0, len = features.length; j < len; j++) {
                        var style = features[j].style;
                        if ( style["fill-position"] != "background" && (style.hasOwnProperty('fill-color') || style.hasOwnProperty('fill-image'))) {
                            Kothic.polygon.render(ctx, features[j], features[j + 1], ws, hs, granularity);
                        }
                    }
                });

                passes.push(function () {
                    // Render line casing
                    ctx.lineCap = "butt";
                    for (var j = 0, len = features.length; j < len; j++) {
                        if (features[j].style.hasOwnProperty("casing-width")) {
                            Kothic.line.renderCasing(ctx, features[j], features[j + 1], ws, hs, granularity);
                        }
                    }

                    //Render line
                    ctx.lineCap = "round";
                    for (var j = 0, len = features.length; j < len; j++) {
                        if (features[j].style.width) {
                            Kothic.line.render(ctx, features[j], features[j + 1], ws, hs, granularity);
                        }
                    }
                });

            })(layers[layerIds[i]]);
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
