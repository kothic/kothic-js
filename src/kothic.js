/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Kothic = (function() {
	var Kothic = {
	};

	function populateLayers(layers, layerIds, data, zoom, styles, additionalStyle) {
		var styledFeatures = Kothic.style.styleFeatures(data.features, zoom, styles, additionalStyle);

		for (var i = 0, len = styledFeatures.length; i < len; i++) {
			var feature = styledFeatures[i],
					layerId = parseFloat(feature.properties.layer) || 0,
					layerStyle = feature.style["-x-mapnik-layer"];

			if (layerStyle == "top") {
				layerId = 10000;
			}
			if (layerStyle == "bottom") {
				layerId = -10000;
			}
			if (!(layerId in layers)) {
				layers[layerId] = [];
				layerIds.push(layerId);
			}
			layers[layerId].push(feature);
		}

		layerIds.sort();
	}

	function addBoundaryCollisions(collisions, width, height) {
		collisions.addBox([0, 0, width, 0]);
		collisions.addBox([0, height, width, 0]);
		collisions.addBox([width, 0, 0, height]);
		collisions.addBox([0, 0, 0, height]);
	}

	function getDebugInfo(start, layersStyled, mapRendered, finish) {
		return {
			layersStyled: layersStyled - start,
			mapRendered: mapRendered - layersStyled,
			iconsAndTextRendered: finish - mapRendered,
			total: finish - start
		};
	}

	function renderBackground(ctx, width, height, zoom, styles) {
		var style = {};
		style = MapCSS.restyle(styles, style, {}, zoom, "canvas", "canvas");
		for (var i = 0; i < style.length; i++) {
			fill(ctx, style, function() {
				ctx.fillRect(-1, -1, width + 1, height + 1);
			});
		}
	}

	Kothic.render = function(canvasId, data, zoom, styles, additionalStyle, onRenderComplete, buffered) {
		var canvas = (typeof canvasId == 'string' ? document.getElementById(canvasId) : canvasId),
				ctx = canvas.getContext('2d'),
				width = canvas.width,
				height = canvas.height,
				granularity = data.granularity,
				ws = width / granularity,
				hs = height / granularity,
				layers = {}, layerIds = [],
				collides = new Kothic.CollisionBuffer(/*ctx, true*/),
				buffer, realCtx;

		var start = +new Date(),
				layersStyled,
				mapRendered,
				finish;

		if (buffered) {
			buffer = document.createElement('canvas');

			buffer.width = width;
			buffer.height = height;

			realCtx = ctx;
			ctx = buffer.getContext('2d');
		}

		if (window.CanvasProxy) {
			ctx = new CanvasProxy(ctx);
		}

		populateLayers(layers, layerIds, data, zoom, styles, additionalStyle);

		layersStyled = +new Date();

		// render

		Kothic.style.setStyles(ctx, Kothic.style.defaultCanvasStyles);

		var layersLen = layerIds.length,
				i, j, features, featuresLen, style;

		var renderMap = function() {
			renderBackground(ctx, width, height, zoom, styles);

			for (i = 0; i < layersLen; i++) {

				features = layers[layerIds[i]];
				featuresLen = features.length;

				for (j = 0; j < featuresLen; j++) {
					style = features[j].style;
					if (('fill-color' in style) || ('fill-image' in style)) {
						Kothic.polygon.render(ctx, features[j], features[j + 1], ws, hs, granularity);
					}
				}

				ctx.lineCap = "butt";

				for (j = 0; j < featuresLen; j++) {
					if ("casing-width" in features[j].style) {
						Kothic.line.renderCasing(ctx, features[j], features[j + 1], ws, hs, granularity);
					}
				}
				ctx.lineCap = "round";

				for (j = 0; j < featuresLen; j++) {
					if (features[j].style.width) {
						Kothic.line.render(ctx, features[j], features[j + 1], ws, hs, granularity);
					}
				}

				mapRendered = +new Date();
			}

			setTimeout(renderIconsAndText, 0);
		};

		var renderIconsAndText = function() {
			addBoundaryCollisions(collides, width, height);
			var textOnCanvasAvailable = ctx.strokeText && ctx.fillText && ctx.measureText;

			for (i = layersLen - 1; i >= 0; i--) {

				features = layers[layerIds[i]];
				featuresLen = features.length;

				// render icons without text
				for (j = featuresLen - 1; j >= 0; j--) {
					style = features[j].style;
					if (("icon-image" in style) && !style["text"]) {
						Kothic.texticons.render(ctx, features[j], collides, ws, hs, false, true);
					}
				}

				// render text on features without icons
				for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
					style = features[j].style;
					if (style["text"] && !("icon-image" in style)) {
						Kothic.texticons.render(ctx, features[j], collides, ws, hs, true, false);
					}
				}

				// for features with both icon and text, render both or neither
				for (j = featuresLen - 1; j >= 0; j--) {
					style = features[j].style;
					if (("icon-image" in style) && style["text"]) {
						Kothic.texticons.render(ctx, features[j], collides, ws, hs, textOnCanvasAvailable, true);
					}
				}

				// render shields with text
				for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
					style = features[j].style;
					if (style["shield-text"]) {
						Kothic.shields.render(ctx, features[j], collides, ws, hs);
					}
				}
			}

			finish = +new Date();

			if (buffered) {
				realCtx.drawImage(buffer, 0, 0);
			}

			onRenderComplete(getDebugInfo(start, layersStyled, mapRendered, finish));
		};

		setTimeout(renderMap, 0);
	};

	return Kothic;
})();
