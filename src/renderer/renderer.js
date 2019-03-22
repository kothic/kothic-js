var line = require("./line");
var polygon = require("./polygon");
var texticons = require("./texticons");
var shields = require("./shields");

function renderBackground(layers, ctx, width, height, zoom) {

  //TODO: StyleManager should create background as a layer instead of messing with styles manually
  // var style = this.styleManager.restyle(styles, {}, {}, zoom, 'canvas', 'canvas');
  //
  // var fillRect = function () {
  //     ctx.fillRect(-1, -1, width + 1, height + 1);
  // };
  //
  // for (var i in style) {
  //     polygon.fill(ctx, style[i], fillRect);
  // }
}

function renderGeometryFeatures(layers, ctx, projectPointFunction, tile_width, tile_height) {
  for (var i = 1; i < layers.length; i++) {
    const queue = layers[i];
    for (var j = 0, len = queue.polygons.length; j < len; j++) {
      polygon.render(ctx, queue.polygons[j], queue.polygons[j + 1], projectPointFunction, tile_width, tile_height);
    }

    //TODO: Move to renderCasing
    ctx.lineCap = 'butt';
    for (var j = 0, len = queue.casings.length; j < len; j++) {
      line.renderCasing(ctx, queue.casings[j], queue.casings[j + 1], projectPointFunction, tile_width, tile_height);
    }

    //TODO: Move to render
    ctx.lineCap = 'round';
    for (var j = 0, len = queue.lines.length; j < len; j++) {
      line.render(ctx, queue.lines[j], queue.lines[j + 1], projectPointFunction, tile_width, tile_height);
    }
  }
}

function renderTextAndIcons(layers, ctx, projectPointFunction, collisionBuffer) {
  for (var i = 1; i < layers.length; i++) {
    const queue = layers[i];

    for (var j = 0; j < queue.icons.length; j++) {
      texticons.render(ctx, queue.icons[j], collisionBuffer, projectPointFunction, false, true);
    }

    for (var j = 0; j < queue.labels.length; j++) {
      texticons.render(ctx, queue.labels[j], collisionBuffer, projectPointFunction, true, false);
    }

    for (var j = 0; j < queue.label_icons.length; j++) {
      texticons.render(ctx, queue.label_icons[j], collisionBuffer, projectPointFunction, true, true);
    }

    for (var j = 0; j < queue.shields.length; j++) {
      shields.render(ctx, queue.shields[j], collisionBuffer, projectPointFunction);
    }
  }
}

function renderCollisions(ctx, node) {
  if (node.leaf) {
    for (var i = 0, len = node.children.length; i < len; i++) {
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 1;
      const a = node.children[i];
      ctx.strokeRect(Math.round(a[0]), Math.round(a[1]), Math.round(a[2] - a[0]), Math.round(a[3] - a[1]));
    }
  } else {
    for (var i = 0, len = node.children.length; i < len; i++) {
      renderCollisions(ctx, node.children[i]);
    }
  }
}

module.exports = {
  renderBackground: renderBackground,
  renderGeometryFeatures: renderGeometryFeatures,
  renderTextAndIcons: renderTextAndIcons,
  renderCollisions: renderCollisions
}
