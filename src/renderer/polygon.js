var path = require('./path');
var setStyles = require('../utils/style').applyStyle;
var MapCSS = require('../style/mapcss');

module.exports = {
  render: function (ctx, feature, nextFeature, projectPointFunction, tile_width, tile_height) {
    var style = feature.style,
      nextStyle = nextFeature && nextFeature.style;

    if (!this.pathOpened) {
      this.pathOpened = true;
      ctx.beginPath();
    }

    path(ctx, feature.geometry, false, true, projectPointFunction, tile_width, tile_height);

    if (context.groupFeaturesByActions &&
        nextFeature &&
        nextFeature.key === feature.key) {
      return;
    }

    this.fill(ctx, style);

    this.pathOpened = false;
  },

  fill: function (ctx, style, fillFn) {
    var opacity = style["fill-opacity"] || style['opacity'], image;

    if (style.hasOwnProperty('fill-color')) {
      // first pass fills with solid color
      setStyles(ctx, {
        fillStyle: style["fill-color"] || "#000000",
        globalAlpha: opacity || 1
      });
      if (fillFn) {
        fillFn();
      } else {
        ctx.fill();
      }
    }

    if (style.hasOwnProperty('fill-image')) {
      // second pass fills with texture
      image = MapCSS.getImage(style['fill-image']);
      if (image) {
        setStyles(ctx, {
          fillStyle: ctx.createPattern(image, 'repeat'),
          globalAlpha: opacity || 1
        });
        if (fillFn) {
          fillFn();
        } else {
          ctx.fill();
        }
      }
    }
  }
};
