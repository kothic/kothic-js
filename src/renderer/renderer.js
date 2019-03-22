'use strict';

const CollisionBuffer = require("../utils/collisions");
const canvasContext = require("../utils/style");
const flow = require("../utils/flow");

const line = require("./line");
const polygon = require("./polygon");
const text = require("./text");
const shield = require("./shield");
const icon = require("./icon");

const renders = {
  casing: line.renderCasing,
  line: line.render,
  polygon: polygon.render,
  text: text.render,
  icon: icon.render,
  shield: shield.render
}


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

function render(layers, ctx, tileWidth, tileHeight, projectPointFunction, getFrame, callback) {
  var collisionBuffer = new CollisionBuffer(tileHeight, tileWidth);
  // render the map
  canvasContext.applyDefaults(ctx);

  const context = {
    collisionBuffer: collisionBuffer,
    gallery: {getImage: () => {throw new "Implement gallery"}},
    tileWidth: tileWidth,
    tileHeight: tileHeight,
    projectPointFunction: projectPointFunction
  }

  const funcs = layers.map((layer) => ((next) => {
    const features = layer.features;

    console.time(layer.render);

    const render = renders[layer.render];
    for (var j = 0, len = features.length; j < len; j++) {
      render(ctx, features[j], features[j + 1], context);
    }

    console.timeEnd(layer.render);

    next();
  }));

  flow.series(funcs, getFrame, () => {
    // if (self.debug) {
    //   renderCollisions(ctx, collisionBuffer.buffer.data);
    // }
    callback();
  });
}

module.exports = {
  render: render
}
