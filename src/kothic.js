/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Kothic = (function() {
	var Kothic = {};

	var pathOpened = false;

	function populateLayers(layers, layerIds, data, zoom, additionalStyle) {
		var styledFeatures = Kothic.style.styleFeatures(data.features, zoom, additionalStyle);

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

	function fill(ctx, style, fillFn) {
		var opacity = style["fill-opacity"] || style.opacity,
				image;

		if (('fill-color' in style)) {
			// first pass fills with solid color
			Kothic.style.setStyles(ctx, {
						fillStyle: style["fill-color"] || "#000000",
						globalAlpha: opacity || 1
					});
			fillFn();
		}

		if ('fill-image' in style) {
			// second pass fills with texture
			image = MapCSS.getImage(style['fill-image']);
			if (image) {
				Kothic.style.setStyles(ctx, {
							fillStyle: ctx.createPattern(image, 'repeat'),
							globalAlpha: opacity || 1
						});
				fillFn();
			}

		}
	}

	function renderBackground(ctx, width, height, zoom) {
		var style = {};
		style = MapCSS.restyle(style, {}, zoom, "canvas", "canvas");
		for (var i = 0; i < style.length; i++) {
			fill(ctx, style, function() {
				ctx.fillRect(-1, -1, width + 1, height + 1);
			});
		}

	}

	function renderPolygonFill(ctx, feature, nextFeature, ws, hs, granularity) {
		var style = feature.style,
				nextStyle = nextFeature && nextFeature.style;

		if (!pathOpened) {
			pathOpened = true;
			ctx.beginPath();
		}
		Kothic.path(ctx, feature, false, true, ws, hs, granularity);

		if (nextFeature &&
				(nextStyle['fill-color'] == style['fill-color']) &&
				(nextStyle['fill-image'] == style['fill-image']) &&
				(nextStyle['fill-opacity'] == style['fill-opacity'])) return;

		fill(ctx, style, function() {
			ctx.fill();
		});

		pathOpened = false;
	}

	function renderCasing(ctx, feature, nextFeature, ws, hs, granularity) {
		var style = feature.style,
				nextStyle = nextFeature && nextFeature.style;

		var dashes = style["casing-dashes"] || style.dashes || false;

		if (!pathOpened) {
			pathOpened = true;
			ctx.beginPath();
		}
		Kothic.path(ctx, feature, dashes, false, ws, hs, granularity);

		if (nextFeature &&
				(nextStyle.width == style.width) &&
				(nextStyle['casing-width'] == style['casing-width']) &&
				(nextStyle['casing-color'] == style['casing-color']) &&
				((nextStyle['casing-dashes'] || nextStyle['dashes'] || false) == (style['casing-dashes'] || style['dashes'] || false)) &&
				((nextStyle['casing-linecap'] || nextStyle['linecap'] || "butt") == (style['casing-linecap'] || style['linecap'] || "butt")) &&
				((nextStyle['casing-linejoin'] || nextStyle['linejoin'] || "round") == (style['casing-linejoin'] || style['linejoin'] || "round")) &&
				((nextStyle['casing-opacity'] || nextStyle['opacity']) == (style['opacity'] || style['casing-opacity']))) return;

		Kothic.style.setStyles(ctx, {
					lineWidth: 2 * style["casing-width"] + ("width" in style ? style["width"] : 0),
					strokeStyle: style["casing-color"] || "#000000",
					lineCap: style["casing-linecap"] || style.linecap || "butt",
					lineJoin: style["casing-linejoin"] || style.linejoin || "round",
					globalAlpha: style["casing-opacity"] || 1
				});

		pathOpened = false;
		ctx.stroke();

	}

	function renderPolyline(ctx, feature, nextFeature, ws, hs, granularity) {
		var style = feature.style,
				nextStyle = nextFeature && nextFeature.style;

		var dashes = style.dashes;

		if (!pathOpened) {
			pathOpened = true;
			ctx.beginPath();
		}
		Kothic.path(ctx, feature, dashes, false, ws, hs, granularity);

		if (nextFeature &&
				((nextStyle.width || 1) == (style.width || 1)) &&
				((nextStyle.color || "#000000") == (style.color || "#000000")) &&
				(nextStyle.linecap == style.linecap) &&
				(nextStyle.linejoin == style.linejoin) &&
				(nextStyle.image == style.image) &&
				(nextStyle.opacity == style.opacity)) return;

		if (('color' in style) || !('image' in style)) {
			Kothic.style.setStyles(ctx, {
						lineWidth: style.width || 1,
						strokeStyle: style.color || '#000000',
						lineCap: style.linecap || "round",
						lineJoin: style.linejoin || "round",
						globalAlpha: style.opacity || 1
					});
			ctx.stroke();
		}


		if ('image' in style) {
			// second pass fills with texture
			var image = MapCSS.getImage(style['image']);
			if (image) {
				Kothic.style.setStyles(ctx, {
							strokeStyle: ctx.createPattern(image, 'repeat') || "#000000",
							lineWidth: style.width || 1,
							lineCap: style.linecap || "round",
							lineJoin: style.linejoin || "round",
							globalAlpha: style.opacity || 1
						});
				ctx.stroke();
			}

		}
		pathOpened = false;
	}

	function renderTextIconOrBoth(ctx, feature, collides, ws, hs, renderText, renderIcon) {
		var style = feature.style,
				reprPoint = Kothic.utils.getReprPoint(feature);

		if (!reprPoint) return;

		var point = Kothic.utils.transformPoint(reprPoint, ws, hs),
				img;

		if (renderIcon) {
			img = MapCSS.getImage(style["icon-image"]);
			if (!img) {
				return;
			}
			if ((style["allow-overlap"] != "true") &&
					collides.checkPointWH(point, img.width, img.height, feature.kothicId)) {
				return;
			}
		}

		if (renderText) {


			Kothic.style.setStyles(ctx, {
						lineWidth: style["text-halo-radius"] * 2,
						font: Kothic.style.getFontString(style["font-family"], style["font-size"])
					});

			var text = style['text'] + '',
					textWidth = ctx.measureText(text).width,
					letterWidth = textWidth / text.length,
					collisionWidth = textWidth,
					collisionHeight = letterWidth * 2.5,
					offset = style["text-offset"] || 0;

			var halo = ("text-halo-radius" in style);

			Kothic.style.setStyles(ctx, {
						fillStyle: style["text-color"] || "#000000",
						strokeStyle: style["text-halo-color"] || "#ffffff",
						globalAlpha: style["text-opacity"] || style["opacity"] || 1,
						textAlign: 'center',
						textBaseline: 'middle'
					});

			if (feature.type == "Polygon" || feature.type == "Point") {
				if ((style["text-allow-overlap"] != "true") &&
						collides.checkPointWH([point[0], point[1] + offset], collisionWidth, collisionHeight, feature.kothicId)) {
					return;
				}

				if (halo) ctx.strokeText(text, point[0], point[1] + offset);
				ctx.fillText(text, point[0], point[1] + offset);

				var padding = style["-x-mapnik-min-distance"] || 20;
				collides.addPointWH([point[0], point[1] + offset], collisionWidth, collisionHeight, padding, feature.kothicId);

			} else if (feature.type == 'LineString') {

				var points = Kothic.utils.transformPoints(feature.coordinates, ws, hs);
				Kothic.textOnPath(ctx, points, text, halo, collides);
			}
		}

		if (renderIcon) {
			ctx.drawImage(img,
					Math.floor(point[0] - img.width / 2),
					Math.floor(point[1] - img.height / 2));

			var padding2 = parseFloat(style["-x-mapnik-min-distance"]) || 0;
			collides.addPointWH(point, img.width, img.height, padding2, feature.kothicId);
		}
	}

	function getDebugInfo(start, layersStyled, mapRendered, finish) {
		return {
			layersStyled: layersStyled - start,
			mapRendered: mapRendered - layersStyled,
			iconsAndTextRendered: finish - mapRendered,
			total: finish - start
		};
	}

	function addBoundaryCollisions (collisions, width, height) {
		collisions.addBox([0, 0, width, 0]);
		collisions.addBox([0, height, width, height]);
		collisions.addBox([width, 0, width, height]);
		collisions.addBox([0, 0, 0, height]);
	}

	Kothic.render = function(canvasId, data, zoom, additionalStyle, onRenderComplete, buffered) {
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

		populateLayers(layers, layerIds, data, zoom, additionalStyle);

		layersStyled = +new Date();

		// render

		Kothic.style.setStyles(ctx, Kothic.style.defaultCanvasStyles);

		var layersLen = layerIds.length,
				i, j, features, featuresLen, style,
				renderMap, renderIconsAndText;

		renderMap = function() {
			renderBackground(ctx, width, height, zoom);

			for (i = 0; i < layersLen; i++) {

				features = layers[layerIds[i]];
				featuresLen = features.length;

				for (j = 0; j < featuresLen; j++) {
					style = features[j].style;
					if (('fill-color' in style) || ('fill-image' in style)) {
						renderPolygonFill(ctx, features[j], features[j + 1], ws, hs, granularity);
					}
				}

				ctx.lineCap = "butt";

				for (j = 0; j < featuresLen; j++) {
					if ("casing-width" in features[j].style) {
						renderCasing(ctx, features[j], features[j + 1], ws, hs, granularity);
					}
				}
				ctx.lineCap = "round";

				for (j = 0; j < featuresLen; j++) {
					if (features[j].style.width) {
						renderPolyline(ctx, features[j], features[j + 1], ws, hs, granularity);
					}
				}

				mapRendered = +new Date();
			}

			setTimeout(renderIconsAndText, 0);
		};

		renderIconsAndText = function() {
			addBoundaryCollisions(collides, width, height);
			var textOnCanvasAvailable = ctx.strokeText && ctx.fillText && ctx.measureText;

			for (i = layersLen - 1; i >= 0; i--) {

				features = layers[layerIds[i]];
				featuresLen = features.length;

				// render icons without text
				for (j = featuresLen - 1; j >= 0; j--) {
					style = features[j].style;
					if (("icon-image" in style) && !style["text"]) {
						renderTextIconOrBoth(ctx, features[j], collides, ws, hs, false, true);
					}
				}

				// render text on features without icons
				for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
					style = features[j].style;
					if (style["text"] && !("icon-image" in style)) {
						renderTextIconOrBoth(ctx, features[j], collides, ws, hs, true, false);
					}
				}

				// for features with both icon and text, render both or neither
				for (j = featuresLen - 1; j >= 0; j--) {
					style = features[j].style;
					if (("icon-image" in style) && style["text"]) {
						renderTextIconOrBoth(ctx, features[j], collides, ws, hs, textOnCanvasAvailable, true);
					}
				}

				// render shields with text
				for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
					style = features[j].style;
					if (style["shield-text"]) {
						Kothic.render.shields(ctx, features[j], collides, ws, hs);
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
