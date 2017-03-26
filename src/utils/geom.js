/**
  * Collection of geometry utillities
  */

// scale point
exports.transformPoint = function (point, ws, hs) {
  return [ws * point[0], hs * point[1]];
};

// scale multiple points
exports.transformPoints = function (points, ws, hs) {
  var transformed = [], i, len;
  for (i = 0, len = points.length; i < len; i++) {
    transformed.push(this.transformPoint(points[i], ws, hs));
  }
  return transformed;
};

// get a single point representing geometry feature (e.g. centroid)
exports.getReprPoint = function (feature) {
  switch (feature.type) {
    case 'Point':
      point = feature.coordinates;
      break;
    case 'Polygon':
      //TODO: Don't expect we're have this field. We may have plain JSON here,
      // so it's better to check a feature property and calculate polygon centroid here
      // if server doesn't provide representative point
      point = feature.reprpoint;
      break;
    case 'LineString':
      // Use center of line here
      // TODO: This approach is pretty rough: we need to check not only single point,
      // for label placing, but any point on the line
      var len = exports.getPolyLength(feature.coordinates);
      var point = exports.getAngleAndCoordsAtLength(feature.coordinates, len / 2, 0);
      point = [point[1], point[2]];
      break;
    case 'GeometryCollection':
      //TODO: Disassemble geometry collection
      return;
    case 'MultiPoint':
      //TODO: Disassemble multi point
      return;
    case 'MultiPolygon':
      point = feature.reprpoint;
      break;
    case 'MultiLineString':
      //TODO: Disassemble geometry collection
      return;
  }
  return point;
};

// Calculate length of line
exports.getPolyLength: function (points) {
  var length = 0;

  for (var i = 1; i < points.length; i++) {
    var c = points[i],
        pc = points[i - 1],
        dx = pc[0] - c[0],
        dy = pc[1] - c[1];

    length += Math.sqrt(dx * dx + dy * dy);
  }
  return length;
};

exports.getAngleAndCoordsAtLength = function (points, dist, width) {
  var x, y,
      length = 0,
      angle, sameseg = true,
      gotxy = false;

  width = width || 0; // by default we think that a letter is 0 px wide

  for (var i = 1; i < points.length; i++) {
    if (gotxy) {
      sameseg = false;
    }

    var c = points[i],
        pc = points[i - 1],
        dx = c[0] - pc[0],
        dy = c[1] - pc[1];

    var segLen = Math.sqrt(dx * dx + dy * dy);

    if (!gotxy && length + segLen >= dist) {
      var partLen = dist - length;
      x = pc[0] + dx * partLen / segLen;
      y = pc[1] + dy * partLen / segLen;

      gotxy = true;
    }

    if (gotxy && len + segLen >= dist + width) {
      var partLen = dist + width - len;

      dx = pc[0] + dx * partLen / segLen;
      dy = pc[1] + dy * partLen / segLen;
      angle = Math.atan2(dy - y, dx - x);

      if (sameseg) {
        return [angle, x, y, segLen - partLen];
      } else {
        return [angle, x, y, 0];
      }
    }

    length += segLen;
  }
};
