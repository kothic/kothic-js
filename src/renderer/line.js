const path = require('./path');
const contextUtils = require('../utils/style');

module.exports = {
  pathOpened: false,
  renderCasing: function (ctx, feature, nextFeature, context) {
    const projectPointFunction = context.projectPointFunction;
    const tileWidth = context.tileWidth;
    const tileHeight = context.tileHeight;

    const actions = feature.actions;
    const nextActions = nextFeature && nextFeature.actions;

    if (!this.pathOpened) {
      this.pathOpened = true;
      ctx.beginPath();
    }

    //TODO: Is MapCSS spec really allows a fallback from "casing-dashes" to "dashes"?
    const dashes = actions['casing-dashes'] || actions['dashes'];

    path(ctx, feature.geometry, dashes, false, projectPointFunction, tileWidth, tileHeight);

    if (nextActions &&
        nextActions['width'] === actions['width'] &&
        nextActions['casing-width'] === actions['casing-width'] &&
        nextActions['casing-color'] === actions['casing-color'] &&
        nextActions['casing-dashes'] === actions['casing-dashes'] &&
        nextActions['casing-opacity'] === actions['casing-opacity']
    ) {
      return;
    }

    const style = {
      'lineWidth': 2 * actions["casing-width"] + actions['width'],
      'strokeStyle': actions["casing-color"],
      'lineCap': actions["casing-linecap"] || actions['linecap'],
      'lineJoin': actions["casing-linejoin"] || actions['linejoin'],
      'globalAlpha': actions["casing-opacity"]
    }

    contextUtils.applyStyle(ctx, style);

    ctx.stroke();
    this.pathOpened = false;
  },

  render: function (ctx, feature, nextFeature, context) {
    const projectPointFunction = context.projectPointFunction;
    const tileWidth = context.tileWidth;
    const tileHeight = context.tileHeight;
    const gallery = context.gallery;

    const actions = feature.actions;
    const nextActions = nextFeature && nextFeature.actions;

    if (!this.pathOpened) {
      this.pathOpened = true;
      ctx.beginPath();
    }

    path(ctx, feature.geometry, actions['dashes'], false, projectPointFunction, tileWidth, tileHeight);

    if (nextFeature &&
                nextActions['width'] === actions['width'] &&
                nextActions['color'] === actions['color'] &&
                nextActions['image'] === actions['image'] &&
                nextActions['opacity'] === actions['opacity']) {
      return;
    }

    const defaultLinejoin = actions['width'] <= 2 ? "miter" : "round";
    const defaultLinecap = actions['width'] <= 2 ? "butt" : "round";

    var strokeStyle;
    if ('image' in actions) {
      const image = gallery.getImage(actions['image']);
      if (image) {
        strokeStyle = ctx.createPattern(image, 'repeat');
      }
    }
    strokeStyle = strokeStyle || actions['color'];

    const style = {
      'strokeStyle': strokeStyle,
      'lineWidth': actions['width'],
      'lineCap': actions['linecap'] || defaultLinejoin,
      'lineJoin': actions['linejoin'] || defaultLinecap,
      'globalAlpha': actions['opacity'],
      'miterLimit': 4
    }

    contextUtils.applyStyle(ctx, style);
    ctx.stroke();

    this.pathOpened = false;
  }
};
