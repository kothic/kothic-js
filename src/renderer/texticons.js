/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Kothic.texticons = (function () {
	function renderTextIconOrBoth(ctx, feature, collides, ws, hs, renderText, renderIcon) {
		var style = feature.style, img, point;
		if (renderIcon || (renderText && feature.type !== "LineString")) {
			var reprPoint = Kothic.utils.getReprPoint(feature);
			if (!reprPoint) {
                return;
            }
			point = Kothic.utils.transformPoint(reprPoint, ws, hs);
		}

		if (renderIcon) {
			img = MapCSS.getImage(style["icon-image"]);
			if (!img) {
				return;
			}
			if ((style["allow-overlap"] !== "true") &&
					collides.checkPointWH(point, img.width, img.height, feature.kothicId)) {
				return;
			}
		}

		if (renderText) {
			Kothic.style.setStyles(ctx, {
                lineWidth: style["text-halo-radius"] * 2,
                font: Kothic.style.getFontString(style["font-family"], style["font-size"])
            });

			var text = String(style.text),
					textWidth = ctx.measureText(text).width,
					letterWidth = textWidth / text.length,
					collisionWidth = textWidth,
					collisionHeight = letterWidth * 2.5,
					offset = style["text-offset"] || 0;

			var halo = (style.hasOwnProperty("text-halo-radius"));

			Kothic.style.setStyles(ctx, {
                fillStyle: style["text-color"] || "#000000",
                strokeStyle: style["text-halo-color"] || "#ffffff",
                globalAlpha: style["text-opacity"] || style.opacity || 1,
                textAlign: 'center',
                textBaseline: 'middle'
            });

			if (feature.type === "Polygon" || feature.type === "Point") {
				if ((style["text-allow-overlap"] !== "true") &&
						collides.checkPointWH([point[0], point[1] + offset], collisionWidth, collisionHeight, feature.kothicId)) {
					return;
				}

				if (halo) {
                    ctx.strokeText(text, point[0], point[1] + offset);
                }
				ctx.fillText(text, point[0], point[1] + offset);

				var padding = style["-x-mapnik-min-distance"] || 20;
				collides.addPointWH([point[0], point[1] + offset], collisionWidth, collisionHeight, padding, feature.kothicId);

			} else if (feature.type === 'LineString') {

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

	return {
		render: renderTextIconOrBoth
	};
}());
