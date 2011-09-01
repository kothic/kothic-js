/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Kothic.polygon = (function () {
	return {
		pathOpened: false,
		render: function (ctx, feature, nextFeature, ws, hs, granularity) {
			var style = feature.style,
					nextStyle = nextFeature && nextFeature.style;

			if (!this.pathOpened) {
				this.pathOpened = true;
				ctx.beginPath();
			}

			Kothic.path(ctx, feature, false, true, ws, hs, granularity);

			if (nextFeature &&
					(nextStyle['fill-color'] === style['fill-color']) &&
					(nextStyle['fill-image'] === style['fill-image']) &&
					(nextStyle['fill-opacity'] === style['fill-opacity'])) {
				return;
			}

			this.fill(ctx, style, function () {
				ctx.fill();
			});

			this.pathOpened = false;
		},
	    fill: function (ctx, style, fillFn) {
		    var opacity = style["fill-opacity"] || style.opacity, image;

		    if (style.hasOwnProperty('fill-color')) {
                // first pass fills with solid color
                Kothic.style.setStyles(ctx, {
                    fillStyle: style["fill-color"] || "#000000",
                    globalAlpha: opacity || 1
                });
                fillFn();
		    }

            if (style.hasOwnProperty('fill-image')) {
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
    };
}());
