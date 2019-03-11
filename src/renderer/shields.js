var path = require('./path');
var setStyles = require('../utils/style').applyStyle;
var getFontString = require('../utils/style').composeFontDeclaration;
var MapCSS = require('../style/mapcss');
var geom = require('../utils/geom');

module.exports = {
    render: function (ctx, feature, collides, ws, hs) {
        var style = feature.style, reprPoint = geom.getReprPoint(feature),
            point, img, len = 0, found = false, i, sgn;

        if (!reprPoint) {
            return;
        }

        point = geom.transformPoint(reprPoint, ws, hs);

        if (style["shield-image"]) {
            img = MapCSS.getImage(style["icon-image"]);

            if (!img) {
                return;
            }
        }

        setStyles(ctx, {
            font: getFontString(style["shield-font-family"] || style["font-family"], style["shield-font-size"] || style["font-size"], style),
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
            len = geom.getPolyLength(feature.coordinates);

            if (Math.max(collisionHeight / hs, collisionWidth / ws) > len) {
                return;
            }

            for (i = 0, sgn = 1; i < len / 2; i += Math.max(len / 30, collisionHeight / ws), sgn *= -1) {
                reprPoint = geom.getAngleAndCoordsAtLength(feature.coordinates, len / 2 + sgn * i, 0);
                if (!reprPoint) {
                    break;
                }

                reprPoint = [reprPoint[1], reprPoint[2]];

                point = geom.transformPoint(reprPoint, ws, hs);
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
            setStyles(ctx, {
                fillStyle: style["shield-casing-color"] || "#000000",
                globalAlpha: style["shield-casing-opacity"] || style.opacity || 1
            });
            var p = style["shield-casing-width"] + (style["shield-frame-width"] || 0);
            ctx.fillRect(point[0] - collisionWidth / 2 - p,
                    point[1] - collisionHeight / 2 - p,
                    collisionWidth + 2 * p,
                    collisionHeight + 2 * p);
        }

        if (style["shield-frame-width"]) {
            setStyles(ctx, {
                fillStyle: style["shield-frame-color"] || "#000000",
                globalAlpha: style["shield-frame-opacity"] || style.opacity || 1
            });
            ctx.fillRect(point[0] - collisionWidth / 2 - style["shield-frame-width"],
                    point[1] - collisionHeight / 2 - style["shield-frame-width"],
                    collisionWidth + 2 * style["shield-frame-width"],
                    collisionHeight + 2 * style["shield-frame-width"]);
        }

        if (style["shield-color"]) {
            setStyles(ctx, {
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
        setStyles(ctx, {
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
};
