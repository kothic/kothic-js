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

function Renderer(options) {
  this.groupFeaturesByActions = options.groupFeaturesByActions || false;
  this.debug = options.debug || false;
  this.projectPointFunction = options.projectPointFunction;
  this.getFrame = options.getFrame;
}

Renderer.prototype.renderBackground = function(layers, ctx, width, height, zoom) {
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
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 1;
  if (node.leaf) {
    node.children.forEach((box) => ctx.strokeRect(box.minX, box.minY, box.maxX - box.minX, box.maxY - box.minY));
  } else {
    node.children.forEach((child) => renderCollisions(ctx, child));
  }
}

Renderer.prototype.render = function(layers, ctx, tileWidth, tileHeight, projectPointFunction, callback) {
  const self = this;

  var collisionBuffer = new CollisionBuffer(tileHeight, tileWidth);
  // render the map
  canvasContext.applyDefaults(ctx);

  const context = {
    collisionBuffer: collisionBuffer,
    gallery: {getImage: () => {throw new "Implement gallery"}},
    tileWidth: tileWidth,
    tileHeight: tileHeight,
    projectPointFunction: projectPointFunction,
    groupFeaturesByActions: self.groupFeaturesByActions
  }

  const funcs = layers.map((layer) => ((next) => {
    const features = layer.features;

    //TODO: Emit event
    console.time(layer.render);

    const renderFn = renders[layer.render];
    for (var j = 0, len = features.length; j < len; j++) {
      renderFn(ctx, features[j], features[j + 1], context);
    }

    //TODO: Emit event
    console.timeEnd(layer.render);

    next();
  }));

  flow.series(funcs, self.getFrame, () => {
    if (self.debug) {
      renderCollisions(ctx, collisionBuffer.buffer.data);
    }
    callback();
  });
}

module.exports = Renderer;
