/**
  * Collection of geometry utillities
  */

// check if the point [in XY coordinates] is on tile's edge
// returns 4-bits bitmask of affected tile boundaries:
//   bit 0 - left
//   bit 1 - right
//   bit 2 - top
//   bit 3 - bottom
exports.isOnTileBoundary = function(p, tile_width, tile_height) {
  var r = 0;
  if (p[0] === 0) {
    r |= 1;
  } else if (p[0] === tile_width) {
    r |= 2;
  }

  if (p[1] === 0) {
    r |= 4;
  } else if (p[1] === tile_height) {
    r |= 8;
  }
  return r;
}

/* check if 2 points are both on the same tile boundary
 *
 * If points of the object are on the same tile boundary it is assumed
 * that the object is cut here and would originally continue beyond the
 * tile borders.
 *
 * This check does not catch the case where the object is located exactly
 * on the tile boundaries, but this case can't properly be detected here.
 */
exports.checkSameBoundary = function(p, q, tile_width, tile_height) {
  var bp = exports.isOnTileBoundary(p, tile_width, tile_height);

  if (!bp) {
    return false;
  }

  return (bp & exports.isOnTileBoundary(q, tile_width, tile_height));
}

// get a single point representing geometry feature (e.g. centroid)
exports.getReprPoint = function (geometry, projectPointFunction) {
  switch (geometry.type) {
  case 'Point':
    point = geometry.coordinates;
    break;
  case 'Polygon':
    //TODO: Don't expect we're have this field. We may have plain JSON here,
    // so it's better to check a feature property and calculate polygon centroid here
    // if server doesn't provide representative point
    point = geometry.reprpoint;
    break;
  case 'LineString':
    // Use center of line here
    // TODO: This approach is pretty rough: we need to check not only single point,
    // for label placing, but any point on the line
    var len = exports.getPolyLength(geometry.coordinates);
    var point = exports.getAngleAndCoordsAtLength(geometry.coordinates, len / 2, 0);
    point = [point[1], point[2]];
    break;
  case 'GeometryCollection':
    //TODO: Disassemble geometry collection
    return;
  case 'MultiPoint':
    //TODO: Disassemble multi point
    return;
  case 'MultiPolygon':
    point = geometry.reprpoint;
    break;
  case 'MultiLineString':
    //TODO: Disassemble geometry collection
    return;
  }
  return projectPointFunction(point);
};

// Calculate length of line
exports.getPolyLength = function (points) {
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

    if (gotxy && length + segLen >= dist + width) {
      var partLen = dist + width - length;

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
