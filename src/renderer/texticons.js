
Kothic.texticons = {

    render: function (ctx, feature, collides, ws, hs, renderText, renderIcon) {
        var style = feature.style, img, point, w, h;

        if (renderIcon || (renderText && feature.type !== 'LineString')) {
            var reprPoint = Kothic.geom.getReprPoint(feature);
            if (!reprPoint) {
                return;
            }
            point = Kothic.geom.transformPoint(reprPoint, ws, hs);
        }

        if (renderIcon) {
            img = MapCSS.getImage(style['icon-image']);
            if (!img) { return; }

            w = img.width;
            h = img.height;

            if (style['icon-width'] || style['icon-height']){
                if (style['icon-width']) {
                    w = style['icon-width'];
                    h = img.height * w / img.width;
                }
                if (style['icon-height']) {
                    h = style['icon-height'];
                    if (!style['icon-width']) {
                        w = img.width * h / img.height;
                    }
                }
            }
            if ((style['allow-overlap'] !== 'true') &&
                    collides.checkPointWH(point, w, h, feature.kothicId)) {
                return;
            }
        }

        var text = String(style.text).trim();

        if (renderText && text) {
            Kothic.style.setStyles(ctx, {
                lineWidth: style['text-halo-radius'] * 2,
                font: Kothic.style.getFontString(style['font-family'], style['font-size'], style)
            });

            var halo = (style.hasOwnProperty('text-halo-radius'));

            Kothic.style.setStyles(ctx, {
                fillStyle: style['text-color'] || '#000000',
                strokeStyle: style['text-halo-color'] || '#ffffff',
                globalAlpha: style['text-opacity'] || style.opacity || 1,
                textAlign: 'center',
                textBaseline: 'middle'
            });

            if (style['text-transform'] === 'uppercase') {
                text = text.toUpperCase();
            }
            else if (style['text-transform'] === 'lowercase') {
                text = text.toLowerCase();
            }
            else if (style['text-transform'] === 'capitalize') {
                text = text.replace(/(^|\s)\S/g, function(ch) { return ch.toUpperCase(); });
            }

            if (feature.type === 'Polygon' || feature.type === 'Point') {
                var maxWidth = parseFloat(style['max-width']) || 0,
                        lines = Kothic.texticons.wrapText(ctx, text, maxWidth),
                        fontSize = parseFloat(style['font-size']) || 9,
                        lineHeight = fontSize * 1.2,
                        textWidths = [],
                        textWidth = 0,
                        collisionWidth,
                        collisionHeight,
                        offset = style['text-offset'] || 0,
                        textY,
                        i;

                for (i = 0; i < lines.length; i++) {
                    textWidths[i] = ctx.measureText(lines[i]).width;
                    textWidth = Math.max(textWidth, textWidths[i]);
                }

                collisionWidth = textWidth;
                collisionHeight = lineHeight * lines.length;

                if ((style['text-allow-overlap'] !== 'true') &&
                        collides.checkPointWH([point[0], point[1] + offset], collisionWidth, collisionHeight, feature.kothicId)) {
                    return;
                }

                textY = point[1] + offset - lineHeight * (lines.length - 1) / 2;

                for (i = 0; i < lines.length; i++) {
                    if (halo) {
                        ctx.strokeText(lines[i], point[0], textY);
                    }
                    ctx.fillText(lines[i], point[0], textY);

                    if (style['text-decoration'] === 'underline') {
                        ctx.fillRect(point[0] - textWidths[i] / 2, textY + fontSize / 2, textWidths[i], Math.max(1, fontSize / 12));
                    }

                    textY += lineHeight;
                }

                var padding = style['-x-kot-min-distance'] || 20;
                collides.addPointWH([point[0], point[1] + offset], collisionWidth, collisionHeight, padding, feature.kothicId);

            } else if (feature.type === 'LineString') {

                var points = Kothic.geom.transformPoints(feature.coordinates, ws, hs);
                Kothic.textOnPath(ctx, points, text, halo, collides);
            }
        }

        if (renderIcon) {
            ctx.drawImage(img,
                    Math.floor(point[0] - w / 2),
                    Math.floor(point[1] - h / 2), w, h);

            var padding2 = parseFloat(style['-x-kot-min-distance']) || 0;
            collides.addPointWH(point, w, h, padding2, feature.kothicId);
        }
    },

    wrapText: function(ctx, text, maxWidth) {
        var words, lines = [], line = '', nextLine, i;

        if (!maxWidth || ctx.measureText(text).width <= maxWidth) {
            return [text];
        }

        words = text.split(/\s+/);

        for (i = 0; i < words.length; i++) {
            nextLine = line ? line + ' ' + words[i] : words[i];

            if (line && ctx.measureText(nextLine).width > maxWidth) {
                lines.push(line);
                line = words[i];
            } else {
                line = nextLine;
            }
        }

        if (line) {
            lines.push(line);
        }

        return lines;
    }
};
