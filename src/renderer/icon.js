'use strict';
var geom = require('../utils/geom');

function renderIcon(ctx, feature, nextFeature, context) {
  const collisionBuffer = context.collisionBuffer;
  const projectPointFunction = context.projectPointFunction;
  const gallery = context.gallery;

  //TODO: Refactor, calculate representative point only once
  const point = geom.getReprPoint(feature.geometry, projectPointFunction);
  if (!point) {
    return;
  }

  const image = gallery.getImage(actions['icon-image']);
  if (!image) {
    return;
  }

  var w = image.width, h = image.height;

  const actions = feature.actions;

  //Zoom image according to values, specified in MapCSS
  if (actions['icon-width'] || actions['icon-height']) {
    if (actions['icon-width']) {
      w = actions['icon-width'];
      h = image.height * w / image.width;
    }
    if (actions['icon-height']) {
      h = actions['icon-height'];
      if (!actions['icon-width']) {
        w = image.width * h / image.height;
      }
    }
  }

  if (!actions['allow-overlap']) {
    if (collisionBuffer.checkPointWH(point, w, h, feature.kothicId)) {
      return;
    }
  }

  ctx.drawImage(image,
    Math.floor(point[0] - w / 2),
    Math.floor(point[1] - h / 2),
    w, h);

  const padding = parseFloat(actions['-x-kothic-padding']) || 0;
  collisionBuffer.addPointWH(point, w, h, padding, feature.kothicId);
}

module.exports.render = renderIcon;
