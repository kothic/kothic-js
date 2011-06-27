/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

var Kothic = {};

Kothic.render = (function() {

	var styleCache = {},
		pathOpened = false,
		lastId = 0;

	var defaultCanvasStyles = {
		strokeStyle: "rgba(0,0,0,0.5)",
		fillStyle: "rgba(0,0,0,0.5)",
		lineWidth: 1,
		lineCap: "round",
		lineJoin: "round",
		textAlign: 'center',
		textBaseline: 'middle'
	};

	function getStyle(feature, zoom, additionalStyle) {
		var id2 = 0;

		if (additionalStyle) {
			id2 = additionalStyle.kothicId = additionalStyle.kothicId || ++lastId;
		}

		var type, selector,
			key = [id2,
			       JSON.stringify(feature.properties),
			       zoom, feature.type].join(':');

		// TODO improve caching mechanism
		// such caching is not as efficient as it might seem because of a lot of objects
		// with the same style except text property

		if (!styleCache[key]) {
			//TODO: propagate type and selector
			if (feature.type == 'Polygon' || feature.type == 'MultiPolygon') {
			    type = 'way';
			    selector = 'area';
			} else if (feature.type == 'LineString' || feature.type == 'MultiLineString') {
			    type = 'way';
			    selector = 'line';
			} else if (feature.type == 'Point' || feature.type == 'MultiPoint') {
			    type = 'node';
			    selector = 'node';
			}
            styleCache[key] = styleCache[key] || {};
			styleCache[key] = MapCSS.restyle(styleCache[key], feature.properties, zoom, type, selector);
			if (additionalStyle) {
				additionalStyle(styleCache[key], feature.properties, zoom, type, selector);
			}
		}

		return styleCache[key];
	}

	function extend(dest, source) {
		for (var i in source) {
			if (source.hasOwnProperty(i)) {
				dest[i] = source[i];
			}
		}
		return dest;
	}

	function compareZIndexes(a, b) {
		return parseFloat(a.style["z-index"] || 0) - parseFloat(b.style["z-index"] || 0);
	}

	function styleFeatures(features, zoom, additionalStyle) {
		var styledFeatures = [],
			i, j, len, feature, style, restyledFeature;

		for (i = 0, len = features.length; i < len; i++) {
			feature = features[i];
			style = getStyle(feature, zoom, additionalStyle);

			for (j in style) {
				if (style.hasOwnProperty(j)) {
					restyledFeature = extend({}, feature);
					restyledFeature.kothicId = i + 1;
					restyledFeature.style = style[j];
					styledFeatures.push(restyledFeature);
				}
			}
		}

		styledFeatures.sort(compareZIndexes);

		return styledFeatures;
	}

	function populateLayers(layers, layerIds, data, zoom, additionalStyle) {
		var styledFeatures = styleFeatures(data.features, zoom, additionalStyle);

		for (var i = 0, len = styledFeatures.length; i < len; i++) {
			var feature = styledFeatures[i],
				layerId = parseFloat(feature.properties.layer) || 0,
				layerStyle = feature.style["-x-mapnik-layer"];

			if (layerStyle == "top" ) {
				layerId = 10000;
			}
			if (layerStyle == "bottom" ) {
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

	function setStyles(ctx, styles) {
		for (var i in styles) {
			if (styles.hasOwnProperty(i)){
				ctx[i] = styles[i];
			}
		}
	}

	function fill(ctx, style, fillFn) {
		var opacity = style["fill-opacity"] || style.opacity,
			image;

		if (('fill-color' in style)) {
			// first pass fills with solid color
			setStyles(ctx, {
				fillStyle: style["fill-color"] || "#000000",
				globalAlpha: opacity || 1
			});
			fillFn();
		}

		if ('fill-image' in style) {
			// second pass fills with texture
			image = MapCSS.getImage(style['fill-image']);
			if (image) {
				setStyles(ctx, {
					fillStyle: ctx.createPattern(image, 'repeat'),
					globalAlpha: opacity || 1
				});
				fillFn();
			}

		}
	}

	function renderBackground(ctx, width, height, zoom) {
		var style = {};
    style = MapCSS.restyle(style, {}, zoom, "canvas", "canvas")['default'];

		fill(ctx, style, function() {
			ctx.fillRect(-1, -1, width + 1, height + 1);
		});

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

		setStyles(ctx, {
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

		if (('color' in style) || not ('image' in style)) {
			setStyles(ctx, {
				lineWidth: style.width || 1,
				strokeStyle: style.color||'#000000',
				lineCap: style.linecap || "round",
				lineJoin: style.linejoin || "round",
				globalAlpha: style.opacity || 1
			});
			ctx.stroke();
		}



		if ('image' in style) {
			// second pass fills with texture
			image = MapCSS.getImage(style['image']);
			if (image) {
				setStyles(ctx, {
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

	function CollisionBuffer(ctx, debugBoxes, debugChecks) {
		this.buffer = [];

		// for debugging
		this.ctx = ctx;
		this.debugBoxes = debugBoxes;
		this.debugChecks = debugChecks;
	}

	CollisionBuffer.prototype = {
		addBox: function(box) {
			this.buffer.push(box);
		},

		addPointWH: function(point, w, h, d, id) {
			var box = this.getBoxFromPoint(point, w, h, d, id);

			this.buffer.push(box);

			if (this.debugBoxes) {
				this.ctx.save();
				this.ctx.strokeStyle = 'red';
				this.ctx.lineWidth = '1';
				this.ctx.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1]);
				this.ctx.restore();
			}
		},

		checkBox: function(b) {
			for (var i = 0, len = this.buffer.length, c; i < len; i++) {
				c = this.buffer[i];

				// if it's the same object (only different styles), don't detect collision
				if (b[4] && (b[4] == c[4])) continue;

				if (c[0] <= b[2] && c[1] <= b[3] && c[2] >= b[0] && c[3] >= b[1]) {
					if (this.debugChecks) {
						this.ctx.save();
						this.ctx.strokeStyle = 'darkblue';
						this.ctx.lineWidth = '1';
						this.ctx.strokeRect(b[0], b[1], b[2] - b[0], b[3] - b[1]);
						this.ctx.restore();
					}
					return true;
				}
			}
			return false;
		},

		checkPointWH: function(point, w, h, id) {
			return this.checkBox(this.getBoxFromPoint(point, w, h, 0, id));
		},

		getBoxFromPoint: function(point, w, h, d, id) {
			return [point[0] - w/2 - d,
			        point[1] - h/2 - d,
			        point[0] + w/2 + d,
			        point[1] + h/2 + d,
			        id];
		}
	};

	function addBoundaryCollisions(collisions, width, height) {
		collisions.addBox([0, 0, width, 0]);
		collisions.addBox([0, height, width, height]);
		collisions.addBox([width, 0, width, height]);
		collisions.addBox([0, 0, 0, height]);
	}

	function getReprPoint(feature) {
		var point, len;
		switch (feature.type) {
			case 'Point': point = feature.coordinates; break;
			case 'Polygon': point = feature.reprpoint; break;
			case 'LineString':	len = Kothic.geomops.getPolyLength(feature.coordinates);
													point = Kothic.geomops.getAngleAndCoordsAtLength(feature.coordinates, len/2, 0);
													point = [point[1],point[2]];
													break;
			case 'GeometryCollection': //TODO: Disassemble geometry collection
			case 'MultiPoint': //TODO: Disassemble multi point
			case 'MultiPolygon': point = feature.reprpoint; break;//TODO: Disassemble multi polygon
			case 'MultiLineString': return; //TODO: Disassemble multi line string
		}
		return point;
	}

	function getFontString(name, size) {
		name = name || '';
		size = size || 9;

		var family = name ? name + ', ' : '';

		name = name.toLowerCase();

		var styles = [];
		if (name.indexOf("italic") != -1 || name.indexOf("oblique") != -1) {
			styles.push('italic');
		}
		if (name.indexOf("bold") != -1) {
			styles.push('bold');
			//family += '"'+name.replace("bold", "")+'", ';
			family += name.replace("bold", "")+ ', ';
		}

		styles.push(size + 'px');

		if (name.indexOf('serif') != -1) {
			family += 'Georgia, serif';
		} else {
			family += '"Helvetica Neue", Arial, Helvetica, sans-serif';
		}
		styles.push(family);


		return styles.join(' ');
	}

	function transformPoint(point, ws, hs, granularity) {
		return [ws * point[0], hs * (granularity - point[1])];
	}

	function transformPoints(points, ws, hs, granularity) {
		var transformed = [];
		for (var i = 0, len = points.length; i < len; i++) {
			transformed.push(transformPoint(points[i], ws, hs, granularity));
		}
		return transformed;
	}

	function renderShield(ctx, feature, collides, ws, hs, granularity) {
		var style = feature.style,
			reprPoint = getReprPoint(feature);
		if (!reprPoint) return;
		var point = transformPoint(reprPoint, ws, hs, granularity),
			img, len = 0, found = false;
		if (style["shield-image"]){
			img = MapCSS.getImage(style["icon-image"]);
			if (!img) return;
		}

		setStyles(ctx, {
			font: getFontString(style["shield-font-family"]||style["font-family"],
													style["shield-font-size"]||style["font-size"]),
			fillStyle: style["shield-text-color"] || "#000000",
			globalAlpha: style["shield-text-opacity"] || style["opacity"] || 1,
			textAlign: 'center',
			textBaseline: 'middle'
		});

		var text = style['shield-text'] + '',
			textWidth = ctx.measureText(text).width,
			letterWidth = textWidth / text.length,
			collisionWidth = textWidth+2,
			collisionHeight = letterWidth * 1.8;
		if (feature.type = 'LineString') {
			len = Kothic.geomops.getPolyLength(feature.coordinates);
			if (Math.max(collisionHeight / hs, collisionWidth/ws) > len) return;
			for (var i = 0, sgn = 1; i += Math.max(len/30, collisionHeight / ws), sgn *= -1; i < len/2 ){
				reprPoint = Kothic.geomops.getAngleAndCoordsAtLength(feature.coordinates, len/2+sgn*i, 0);
				if (!reprPoint) break;
				reprPoint = [reprPoint[1],reprPoint[2]];
				point = transformPoint(reprPoint, ws, hs, granularity);
				if (img && (style["allow-overlap"] != "true") &&
					collides.checkPointWH(point, img.width, img.height, feature.kothicId)) continue;
				if ((style["allow-overlap"] != "true") &&
					collides.checkPointWH(point, collisionWidth, collisionHeight, feature.kothicId)) continue;
				found = true;
				break;
			}
		}
		if (!found) return;

		if (style["shield-casing-width"]){
			setStyles(ctx, {
				fillStyle: style["shield-casing-color"] || "#000000",
				globalAlpha: style["shield-casing-opacity"] || style["opacity"] || 1
			});
			ctx.fillRect(point[0] - collisionWidth/2 - (style["shield-casing-width"]||0) - (style["shield-frame-width"]||0),
									 point[1] - collisionHeight/2 - (style["shield-casing-width"]||0) - (style["shield-frame-width"]||0),
									 collisionWidth + 2*(style["shield-casing-width"]||0) + 2*(style["shield-frame-width"]||0),
									 collisionHeight + 2*(style["shield-casing-width"]||0) + 2*(style["shield-frame-width"]||0));
		}
		if (style["shield-frame-width"]){
			setStyles(ctx, {
				fillStyle: style["shield-frame-color"] || "#000000",
				globalAlpha: style["shield-frame-opacity"] || style["opacity"] || 1
			});
			ctx.fillRect(point[0] - collisionWidth/2 - (style["shield-frame-width"]||0),
									 point[1] - collisionHeight/2  - (style["shield-frame-width"]||0),
									 collisionWidth + 2*(style["shield-frame-width"]||0),
									 collisionHeight + 2*(style["shield-frame-width"]||0));
		}
		if (style["shield-color"]){
			setStyles(ctx, {
				fillStyle: style["shield-color"] || "#000000",
				globalAlpha: style["shield-opacity"] || style["opacity"] || 1
			});
			ctx.fillRect(point[0] - collisionWidth/2,
									 point[1] - collisionHeight/2,
									 collisionWidth,
									 collisionHeight);
		}
		setStyles(ctx, {
				fillStyle: style["shield-text-color"] || "#000000",
				globalAlpha: style["shield-text-opacity"] || style["opacity"] || 1
		});
		console.log(point);
		ctx.fillText(text, point[0], Math.ceil(point[1]));
		if (img) collides.addPointWH(point, img.width, img.height, 0, feature.kothicId);
		collides.addPointWH(point, collisionHeight, collisionWidth,
												(style["shield-casing-width"]||0) + (style["shield-frame-width"]||0), feature.kothicId);
	}

	function renderTextIconOrBoth(ctx, feature, collides, ws, hs, granularity, renderText, renderIcon) {
		var style = feature.style,
			reprPoint = getReprPoint(feature);

		if (!reprPoint) return;

		var point = transformPoint(reprPoint, ws, hs, granularity),
			img;

		if (renderIcon) {
			img = MapCSS.getImage(style["icon-image"]);
			if (!img) return;
			if ((style["allow-overlap"] != "true") &&
					collides.checkPointWH(point, img.width, img.height, feature.kothicId)) return;
		}

		if (renderText) {


			setStyles(ctx, {
				lineWidth: style["text-halo-radius"] * 2,
				font: getFontString(style["font-family"], style["font-size"])
			});

			var text = style['text'] + '',
				textWidth = ctx.measureText(text).width,
				letterWidth = textWidth / text.length,
				collisionWidth = textWidth,
				collisionHeight = letterWidth * 2.5,
				offset = style["text-offset"] || 0;
			//var positions = style["text-positions"]


			var halo = ("text-halo-radius" in style);

			setStyles(ctx, {
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

				var points = transformPoints(feature.coordinates, ws, hs, granularity);
				Kothic.textOnPath(ctx, points, text, halo, collides);
			}
		}

		if (renderIcon) {
			ctx.drawImage(img,
					Math.floor(point[0] - img.width / 2),
					Math.floor(point[1] - img.height / 2));

			var padding = parseFloat(style["-x-mapnik-min-distance"]) || 0;

			collides.addPointWH(point, img.width, img.height, padding, feature.kothicId);
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


	return function(canvasId, data, zoom, additionalStyle, onRenderComplete, buffered) {

		var canvas = (typeof canvasId == 'string' ? document.getElementById(canvasId) : canvasId),
			ctx = canvas.getContext('2d'),
			width = canvas.width,
			height = canvas.height,
			granularity = data.granularity,
			ws = width / granularity,
			hs = height / granularity,
			layers = {}, layerIds = [],
			collides = new CollisionBuffer(/*ctx, true*/),
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

		populateLayers(layers, layerIds, data, zoom, additionalStyle);

		layersStyled = +new Date();

		// render

		setStyles(ctx, defaultCanvasStyles);

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
						renderPolygonFill(ctx, features[j], features[j+1], ws, hs, granularity);
					}
				}

				ctx.lineCap = "butt";

				for (j = 0; j < featuresLen; j++) {
					if ("casing-width" in features[j].style) {
						renderCasing(ctx, features[j], features[j+1], ws, hs, granularity);
					}
				}
				ctx.lineCap = "round";

				for (j = 0; j < featuresLen; j++) {
					if (features[j].style.width) {
						renderPolyline(ctx, features[j], features[j+1], ws, hs, granularity);
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
						renderTextIconOrBoth(ctx, features[j], collides, ws, hs, granularity, false, true);
					}
				}

				// render text on features without icons
				for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
					style = features[j].style;
					if (style["text"] && !("icon-image" in style)) {
						renderTextIconOrBoth(ctx, features[j], collides, ws, hs, granularity, true, false);
					}
				}

				// for features with both icon and text, render both or neither
				for (j = featuresLen - 1; j >= 0; j--) {
					style = features[j].style;
					if (("icon-image" in style) && style["text"]) {
						renderTextIconOrBoth(ctx, features[j], collides, ws, hs, granularity, textOnCanvasAvailable, true);
					}
				}

				// render shields with text
				for (j = featuresLen - 1; textOnCanvasAvailable && j >= 0; j--) {
					style = features[j].style;
					if (style["shield-text"]) {
						renderShield(ctx, features[j], collides, ws, hs, granularity);
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
}());
