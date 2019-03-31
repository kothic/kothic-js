'use strict';

var geom = require('../utils/geom');
var style = require('../utils/style');
var textOnPath = require("./textonpath").textOnPath;

function renderText(ctx, feature, nextFeature, context) {
  const collisionBuffer = context.collisionBuffer;
  const projectPointFunction = context.projectPointFunction;

  const actions = feature.actions;

  const text = String(actions.text).trim();

  const hasHalo = 'text-halo-radius' in actions;

  style.applyStyle(ctx, {
    lineWidth: actions['text-halo-radius'] || 0,
    font: style.composeFontDeclaration(actions['font-family'], actions['font-size'], actions),
    fillStyle: actions['text-color'] || '#000000',
    strokeStyle: actions['text-halo-color'] || '#ffffff',
    globalAlpha: actions['text-opacity'] || actions['opacity'] || 1,
    textAlign: 'center',
    textBaseline: 'middle'
  });

  if (actions['text-transform'] === 'uppercase') {
    text = text.toUpperCase();
  } else if (actions['text-transform'] === 'lowercase') {
    text = text.toLowerCase();
  } else if (actions['text-transform'] === 'capitalize') {
    text = text.replace(/(^|\s)\S/g, function(ch) { return ch.toUpperCase(); });
  }

  if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'Point') {
    //TODO: Refactor, calculate representative point only once
    const point = geom.getReprPoint(feature.geometry, projectPointFunction);
    if (!point) {
      return;
    }

    const textWidth = ctx.measureText(text).width;
    const letterWidth = textWidth / text.length;
    const width = textWidth;
    const height = letterWidth * 2.5;
    const offset = actions['text-offset'] || 0;

    const center = [point[0], point[1] + offset];
    if (!actions['text-allow-overlap']) {
      if (collisionBuffer.checkPointWH(center, width, height, feature.kothicId)) {
        return;
      }
    }

    if (hasHalo) {
      ctx.strokeText(text, center[0], center[1]);
    }
    ctx.fillText(text, center[0], center[1]);

    const padding = parseFloat(actions['-x-kothic-padding']) || 0;
    collisionBuffer.addPointWH(point, width, height, padding, feature.kothicId);

  } else if (feature.geometry.type === 'LineString') {
    const points = feature.geometry.coordinates.map(projectPointFunction);
    textOnPath(ctx, points, text, hasHalo, collisionBuffer);
  }
}

module.exports.render = renderText;
