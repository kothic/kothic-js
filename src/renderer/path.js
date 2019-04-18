'use strict';

const geom = require('../utils/geom');

/**
 ** Render features on Canvas
 **/

function drawRing(points, ctx, tileWidth, tileHeight, drawOnTileEdges) {
  if (points.length <= 1) {
    //Geometry is too short
    return;
  }

  ctx.moveTo(points[0][0], points[0][1]);

  //TODO: Those constants MUST be configured un upper design level
  const padding = 50; // how many pixels to draw out of the tile to avoid path edges when lines crosses tile borders
  const skip = 1; // do not draw line segments shorter than this

  for (let j = 1, pointsLen = points.length; j < pointsLen; j++) {
    const point = points[j];
    //const prevPoint = points[j - 1]

    //TODO: Make padding an option to let user prepare data with padding
    // continue path off the tile by some amount to fix path edges between tiles
    if ((j === 0 || j === pointsLen - 1) && geom.isOnTileBoundary(point, tileWidth, tileHeight)) {
      let k = j;
      let dist, dx, dy;
      do {
        k = j ? k - 1 : k + 1;
        if (k < 0 || k >= pointsLen) {
          break;
        }

        const prevPoint = points[k];

        dx = point[0] - prevPoint[0];
        dy = point[1] - prevPoint[1];
        dist = Math.sqrt(dx * dx + dy * dy);
      } while (dist <= skip);

      // all points are so close to each other that it doesn't make sense to
      // draw the line beyond the tile border, simply skip the entire line from
      // here
      if (k < 0 || k >= pointsLen) {
        break;
      }

      point[0] = point[0] + padding * dx / dist;
      point[1] = point[1] + padding * dy / dist;
    }

    if (!drawOnTileEdges && geom.checkSameBoundary(point, points[j - 1], tileWidth, tileHeight)) {
      // Don't draw lines on tile boundaries
      ctx.moveTo(point[0], point[1]);
    } else {
      // Draw a line or filling contour
      ctx.lineTo(point[0], point[1]);
    }
  }
}

module.exports = function(ctx, geometry, dashes, drawOnTileEdges, projectPointFunction, tileWidth, tileHeight) {
  var type = geometry.type,
    coords = geometry.coordinates;

  //Convert single feature to a mult-type to make rendering easier
  if (type === "Polygon") {
    coords = [coords];
    type = "MultiPolygon";
  } else if (type === "LineString") {
    coords = [coords];
    type = "MultiLineString";
  }

  if (dashes) {
    ctx.setLineDash(dashes);
  } else {
    ctx.setLineDash([]);
  }

  if (type === "MultiPolygon") {
    //Iterate by Polygons in MultiPolygon
    for (let i = 0, polygonsLength = coords.length; i < polygonsLength; i++) {
      //Iterate by Rings of the Polygon
      for (let j = 0, ringsLength = coords[i].length; j < ringsLength; j++) {
        const points = coords[i][j].map(projectPointFunction);

        drawRing(points, ctx, tileWidth, tileHeight, drawOnTileEdges);
      }
    }
  } else if (type === "MultiLineString") {
    //Iterate by Lines in MultiLineString
    for (let i = 0, linesLength = coords.length; i < linesLength; i++) {
      const points = coords[i].map(projectPointFunction);

      drawRing(points, ctx, tileWidth, tileHeight, false)
    }
  }
};
