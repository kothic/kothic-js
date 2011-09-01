/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Kothic.shields = (function () {
	function render(ctx, feature, collides, ws, hs) {
		var style = feature.style, reprPoint = Kothic.utils.getReprPoint(feature), 
            point, img, len = 0, found = false, i, sgn;

		if (!reprPoint) {
			return;
		}

		point = Kothic.utils.transformPoint(reprPoint, ws, hs);

		if (style["shield-image"]) {
			img = MapCSS.getImage(style["icon-image"]);

			if (!img) {
				return;
			}
		}

		Kothic.style.setStyles(ctx, {
            font: Kothic.style.getFontString(style["shield-font-family"] || style["font-family"], style["shield-font-size"] || style["font-size"]),
            fillStyle: style["shield-text-color"] || "#000000",
            globalAlpha: style["shield-text-opacity"] || style.opacity || 1,
            textAlign: 'center',
            textBaseline: 'middle'
        });

		var text = String(style['shield-text']),
				textWidth = ctx.measureText(text).width,
				letterWidth = textWidth / text.length,
				collisionWidth = textWidth + 2,
				collisionHeight = letterWidth * 1.8;

		if (feature.type === 'LineString') {
			len = Kothic.geomops.getPolyLength(feature.coordinates);

			if (Math.max(collisionHeight / hs, collisionWidth / ws) > len) {
				return;
			}

			for (i = 0, sgn = 1; i < len / 2; i += Math.max(len / 30, collisionHeight / ws), sgn *= -1) {
				reprPoint = Kothic.geomops.getAngleAndCoordsAtLength(feature.coordinates, len / 2 + sgn * i, 0);
				if (!reprPoint) {
					break;
				}

				reprPoint = [reprPoint[1], reprPoint[2]];

				point = Kothic.utils.transformPoint(reprPoint, ws, hs);
				if (img && (style["allow-overlap"] !== "true") &&
						collides.checkPointWH(point, img.width, img.height, feature.kothicId)) {
					continue;
				}
				if ((style["allow-overlap"] !== "true") &&
						collides.checkPointWH(point, collisionWidth, collisionHeight, feature.kothicId)) {
					continue;
				}
				found = true;
				break;
			}
		}

		if (!found) {
			return;
		}

		if (style["shield-casing-width"]) {
			Kothic.style.setStyles(ctx, {
                fillStyle: style["shield-casing-color"] || "#000000",
                globalAlpha: style["shield-casing-opacity"] || style.opacity || 1
            });
			ctx.fillRect(point[0] - collisionWidth / 2 - (style["shield-casing-width"] || 0) - (style["shield-frame-width"] || 0),
					point[1] - collisionHeight / 2 - (style["shield-casing-width"] || 0) - (style["shield-frame-width"] || 0),
					collisionWidth + 2 * (style["shield-casing-width"] || 0) + 2 * (style["shield-frame-width"] || 0),
					collisionHeight + 2 * (style["shield-casing-width"] || 0) + 2 * (style["shield-frame-width"] || 0));
		}

		if (style["shield-frame-width"]) {
			Kothic.style.setStyles(ctx, {
                fillStyle: style["shield-frame-color"] || "#000000",
                globalAlpha: style["shield-frame-opacity"] || style.opacity || 1
            });
			ctx.fillRect(point[0] - collisionWidth / 2 - (style["shield-frame-width"] || 0),
					point[1] - collisionHeight / 2 - (style["shield-frame-width"] || 0),
					collisionWidth + 2 * (style["shield-frame-width"] || 0),
					collisionHeight + 2 * (style["shield-frame-width"] || 0));
		}

		if (style["shield-color"]) {
			Kothic.style.setStyles(ctx, {
                fillStyle: style["shield-color"] || "#000000",
                globalAlpha: style["shield-opacity"] || style.opacity || 1
            });
			ctx.fillRect(point[0] - collisionWidth / 2,
					point[1] - collisionHeight / 2,
					collisionWidth,
					collisionHeight);
		}

		if (img) {
            ctx.drawImage(img,
				Math.floor(point[0] - img.width / 2),
				Math.floor(point[1] - img.height / 2));
        }
		Kothic.style.setStyles(ctx, {
            fillStyle: style["shield-text-color"] || "#000000",
            globalAlpha: style["shield-text-opacity"] || style.opacity || 1
        });

		ctx.fillText(text, point[0], Math.ceil(point[1]));
		if (img) {
			collides.addPointWH(point, img.width, img.height, 0, feature.kothicId);
		}

		collides.addPointWH(point, collisionHeight, collisionWidth,
				(parseFloat(style["shield-casing-width"]) || 0) + (parseFloat(style["shield-frame-width"]) || 0) + (parseFloat(style["-x-mapnik-min-distance"]) || 30), feature.kothicId);

	}

	return {render: render};
}());
