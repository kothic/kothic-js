'use strict';

const geom = require('../utils/geom');
const contextUtils = require('../utils/style');
//var textOnPath = require("./textonpath").textOnPath;
const textOnPath = require("./curvedtext").render

function renderText(ctx, feature, nextFeature, {projectPointFunction, collisionBuffer}) {
  const actions = feature.actions;

  const hasHalo = 'text-halo-radius' in actions && parseInt(actions['text-halo-radius']) > 0;

  const style = {
    lineWidth: actions['text-halo-radius'],
    font: contextUtils.composeFontDeclaration(actions['font-family'], actions['font-size'], actions),
    fillStyle: actions['text-color'],
    strokeStyle: actions['text-halo-color'],
    globalAlpha: actions['text-opacity'] || actions['opacity'],
    textAlign: 'center',
    textBaseline: 'middle'
  };

  contextUtils.applyStyle(ctx, style);

  var text = String(actions.text).trim();
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
    const offsetY = actions['text-offset'];

    const center = [point[0], point[1] + offsetY];
    if (!actions['text-allow-overlap']) {
      if (collisionBuffer.checkPointWH(center, width, height, feature.kothicId)) {
        return;
      }
    }

    if (hasHalo) {
      ctx.strokeText(text, center[0], center[1]);
    }
    ctx.fillText(text, center[0], center[1]);

    const padding = parseFloat(actions['-x-kothic-padding']);
    collisionBuffer.addPointWH(point, width, height, padding, feature.kothicId);
  } else if (feature.geometry.type === 'LineString') {
    const points = feature.geometry.coordinates.map(projectPointFunction);
    textOnPath(ctx, points, text, hasHalo, collisionBuffer);
  }
}

module.exports.render = renderText;
