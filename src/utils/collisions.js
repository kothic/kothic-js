'use strict';
const rbush = require('rbush');

const CollisionBuffer = function (height, width) {
  this.buffer = rbush(256);
  this.height = height;
  this.width = width;
};

function getBoxFromPoint(point, width, height, padding, id) {
  const dx = width / 2 + padding;
  const dy = height / 2 + padding;

  return {
    minX: point[0] - dx,
    minY: point[1] - dy,
    maxX: point[0] + dx,
    maxY: point[1] + dy,
    id: id
  };
}

CollisionBuffer.prototype.addPointWH = function (point, width, height, padding, id) {
  this.buffer.insert(getBoxFromPoint(point, width, height, padding, id));
}

CollisionBuffer.prototype.addPoints = function (params) {
  const points = params.map((args) => getBoxFromPoint.apply(null, args));
  this.buffer.load(points);
}

CollisionBuffer.prototype.checkPointWH = function (point, width, height, id) {
  const box = getBoxFromPoint(point, width, height, 0);

  //Always show collision outside the CollisionBuffer
  //TODO: Why do we need this???
  if (box.minX < 0 || box.minY < 0 || box.maxX > this.width || box.maxY > this.height) {
    return true;
  }

  const result = this.buffer.search(box);

  for (var i = 0, len = result.length; i < len; i++) {
    // Object with same ID doesn't induce a collision, but different ids does
    if (id !== result[i].id) {
      return true;
    }
  }

  return false;
}

module.exports = CollisionBuffer;
