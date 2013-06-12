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

        var styles = options && options.styles || [];

        MapCSS.locales = options && options.locales || [];

        var devicePixelRatio = window.devicePixelRatio || 1;

        var width = canvas.width,
            height = canvas.height;

        if (devicePixelRatio != 1) {
            canvas.style.width = canvas.width + "px";
            canvas.style.height = canvas.height + "px";
            canvas.width = canvas.width * devicePixelRatio;
            canvas.height = canvas.height * devicePixelRatio;
        }

        var ctx = canvas.getContext('2d');
        ctx.scale(devicePixelRatio, devicePixelRatio);

		var granularity = data.granularity,
            ws = width / granularity, hs = height / granularity,
            styles = this._styles,
            collisionBuffer = new Kothic.CollisionBuffer(height, width);

        //Setup layer styles
		var layers = Kothic.style.populateLayers(data.features, zoom, styles);
        var layerIds = Object.keys(layers).sort();

		//Render the map
		Kothic.style.setStyles(ctx, Kothic.style.defaultCanvasStyles);

        var v = this;

		var renderIconsAndText = function () {
            var stats = v._renderTextAndIcons(layerIds, layers, ctx, ws, hs, collisionBuffer);

			if (options && options.onRenderComplete) {
                options.onRenderComplete();
            }
		};

		var renderMap = function () {
			v._renderBackground(ctx, width, height, zoom, styles);

            var stats = v._renderGeometryFeatures(layerIds, layers, ctx, ws, hs, granularity);

			setTimeout(renderIconsAndText, 0);
		};


		setTimeout(renderMap, 0);
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
        var j, i;

        for (i = 0; i < layerIds.length; i++) {
            var features = layers[layerIds[i]], featuresLen = features.length;
            // Render background polygon
            for (j = 0; j < featuresLen; j++) {
                var style = features[j].style;
                if (style["fill-position"] == 'background' && (style.hasOwnProperty('fill-color') || style.hasOwnProperty('fill-image'))) {
                    Kothic.polygon.render(ctx, features[j], features[j + 1], ws, hs, granularity);
                }
            }
        }

        for (i = 0; i < layerIds.length; i++) {
            var features = layers[layerIds[i]], featuresLen = features.length;

            // Render polygon
            for (j = 0; j < featuresLen; j++) {
                var style = features[j].style;
                if ( style["fill-position"] != "background" && (style.hasOwnProperty('fill-color') || style.hasOwnProperty('fill-image'))) {
                    Kothic.polygon.render(ctx, features[j], features[j + 1], ws, hs, granularity);
                }
            }

            // Render line casing
            ctx.lineCap = "butt";
            for (j = 0; j < featuresLen; j++) {
                if (features[j].style.hasOwnProperty("casing-width")) {
                    Kothic.line.renderCasing(ctx, features[j], features[j + 1], ws, hs, granularity);
                }
            }

            //Render line
            ctx.lineCap = "round";
            for (j = 0; j < featuresLen; j++) {
                if (features[j].style.width) {
                    Kothic.line.render(ctx, features[j], features[j + 1], ws, hs, granularity);
                }
            }
        }

    },

    _renderTextAndIcons: function (layerIds, layers, ctx, ws, hs, collisionBuffer) {
        //TODO: Move to the features detector
        var textOnCanvasAvailable = ctx.strokeText && ctx.fillText && ctx.measureText;
        var j, style, i;

        for (i = 0; i < layerIds.length; i++) {
            var features = layers[layerIds[i]], featuresLen = features.length;

            // render icons without text
            for (j = featuresLen - 1; j >= 0; j--) {
                style = features[j].style;
                if (style.hasOwnProperty('icon-image') && !style.text) {
                    Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, false, true);
                }
            }

            // render text on features without icons
            for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
                style = features[j].style;
                if (!style.hasOwnProperty('icon-image') && style.text) {
                    Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, true, false);
                }
            }

            // for features with both icon and text, render both or neither
            for (j = featuresLen - 1; j >= 0; j--) {
                style = features[j].style;
                if (style.hasOwnProperty('icon-image') && style.text) {
                    Kothic.texticons.render(ctx, features[j], collisionBuffer, ws, hs, textOnCanvasAvailable, true);
                }
            }

            // render shields with text
            for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
                style = features[j].style;
                if (style["shield-text"]) {
                    Kothic.shields.render(ctx, features[j], collisionBuffer, ws, hs);
                }
            }
        }
    }
};
