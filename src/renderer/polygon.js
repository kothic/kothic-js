//'use strict';

const path = require('./path');
const contextUtils = require('../utils/style');

module.exports = {
  pathOpened: false,
  render: function (ctx, feature, nextFeature, {projectPointFunction, tileWidth, tileHeight, groupFeaturesByActions, gallery}) {
    const actions = feature.actions;
    const nextActions = nextFeature && nextFeature.actions;
    if (!this.pathOpened) {
      this.pathOpened = true;
      ctx.beginPath();
    }

    path(ctx, feature.geometry, false, true, projectPointFunction, tileWidth, tileHeight);

    if (groupFeaturesByActions &&
        nextFeature &&
        nextFeature.key === feature.key) {
      return;
    }

    if ('fill-color' in actions) {
      // first pass fills with solid color
      let style = {
        fillStyle: actions["fill-color"],
        globalAlpha: actions["fill-opacity"] || actions['opacity']
      };

      contextUtils.applyStyle(ctx, style);
      ctx.fill();
    }

    if ('fill-image' in actions) {
      // second pass fills with texture
      const image = gallery.getImage(actions['fill-image']);
      if (image) {
        let style = {
          fillStyle: ctx.createPattern(image, 'repeat'),
          globalAlpha: actions["fill-opacity"] || actions['opacity']
        };
        contextUtils.applyStyle(ctx, style);
        ctx.fill();
      }
    }

    this.pathOpened = false;
  }
};
