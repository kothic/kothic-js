
Kothic.line = {

    hasRenderableDashes: function(dashes) {
        return Kothic.path.normalizeDashes(dashes).length > 0;
    },

    renderCasing: function (ctx, feature, nextFeature, ws, hs, granularity) {
        var style = feature.style,
            nextStyle = nextFeature && nextFeature.style,
            casingDashes = style["casing-dashes"] || style.dashes;

        if (!this.pathOpened) {
            this.pathOpened = true;
            ctx.beginPath();
        }

        Kothic.path(ctx, feature, casingDashes, false, ws, hs, granularity);

        if (nextFeature &&
                !this.hasRenderableDashes(casingDashes) &&
                !this.hasRenderableDashes(nextStyle["casing-dashes"] || nextStyle.dashes) &&
                nextStyle.width === style.width &&
                nextStyle['casing-width'] === style['casing-width'] &&
                nextStyle['casing-color'] === style['casing-color'] &&
                nextStyle['casing-dashes'] === style['casing-dashes'] &&
                nextStyle['casing-opacity'] === style['casing-opacity']) {
            return;
        }

        Kothic.style.setStyles(ctx, {
            lineWidth: 2 * style["casing-width"] + (style.hasOwnProperty("width") ? style.width : 0),
            strokeStyle: style["casing-color"] || "#000000",
            lineCap: style["casing-linecap"] || style.linecap || "butt",
            lineJoin: style["casing-linejoin"] || style.linejoin || "round",
            globalAlpha: style["casing-opacity"] || 1
        });

        ctx.stroke();
        this.pathOpened = false;
    },

    render: function (ctx, feature, nextFeature, ws, hs, granularity) {
        var style = feature.style,
            nextStyle = nextFeature && nextFeature.style;

        if (!this.pathOpened) {
            this.pathOpened = true;
            ctx.beginPath();
        }

        Kothic.path(ctx, feature, style.dashes, false, ws, hs, granularity);

        if (nextFeature &&
                !this.hasRenderableDashes(style.dashes) &&
                !this.hasRenderableDashes(nextStyle.dashes) &&
                nextStyle.width === style.width &&
                nextStyle.color === style.color &&
                nextStyle.image === style.image &&
                nextStyle.opacity === style.opacity) {
            return;
        }

        if ('color' in style || !('image' in style)) {
            var t_width = style.width || 1,
                t_linejoin = "round",
                t_linecap = "round";

            if (t_width <= 2) {
                t_linejoin = "miter";
                t_linecap = "butt";
            }
            Kothic.style.setStyles(ctx, {
                lineWidth: t_width,
                strokeStyle: style.color || '#000000',
                lineCap: style.linecap || t_linecap,
                lineJoin: style.linejoin || t_linejoin,
                globalAlpha: style.opacity || 1,
                miterLimit: 4
            });
            ctx.stroke();
        }


        if ('image' in style) {
            // second pass fills with texture
            var image = MapCSS.getImage(style.image);

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
        this.pathOpened = false;
    },

    pathOpened: false
};
