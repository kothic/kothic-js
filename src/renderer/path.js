'use strict';

const geom = require('../utils/geom');

/**
 ** Render features on Canvas
 **/

//TODO: split configuration and call
module.exports = function(ctx, geometry, dashes, fill, projectPointFunction, tileWidth, tileHeight) {
  var type = geometry.type,
    coords = geometry.coordinates;

  //TODO: Extract to StyleManager
  if (dashes) {
    dashes = dashes.split(",").map(parseFloat);
  }

  //Convert single feature to a mult-type to make rendering easier
  if (type === "Polygon") {
    coords = [coords];
    type = "MultiPolygon";
  } else if (type === "LineString") {
    coords = [coords];
    type = "MultiLineString";
  }

  // var points,
  //   len = coords.length,
  //   len2, pointsLen,
  //   prevPoint, point, screenPoint,
  //   dx, dy, dist;

  if (type === "MultiPolygon") {
    //Iterate by Polygons in MultiPolygon
    for (let i = 0, polygonsLength = coords.length; i < polygonsLength; i++) {
      //Iterate by Rings of the Polygon
      for (let k = 0, ringsLength = coords[i].length; k < ringsLength; k++) {
        const points = coords[i][k].map(projectPointFunction);
        //pointsLen = points.length;
        let prevPoint = points[0];

        //Iterate by points
        for (let j = 0, pointsLength = points.length; j <= pointsLength; j++) {
          //Close the ring from last to first point
          const point = points[j] || points[0];

          // const screenPoint = projectPointFunction(point);
          //Start drawing from first point
          if (j === 0) {
            ctx.moveTo(point[0], point[1]);

            if (dashes) {
              ctx.setLineDash(dashes);
            } else {
              ctx.setLineDash([]);
            }
          } else if (!fill && geom.checkSameBoundary(point, prevPoint, tileWidth, tileHeight)) {
            // Don't draw lines on tile boundaries
            ctx.moveTo(point[0], point[1]);
          } else {
            // Draw a line or filling contour
            ctx.lineTo(point[0], point[1]);
          }

          prevPoint = point;
        }
      }
    }
  } else if (type === "MultiLineString") {
    // //TODO: Those constants MUST be configured un upper design level
    var pad = 50, // how many pixels to draw out of the tile to avoid path edges when lines crosses tile borders
      skip = 0;//2; // do not draw line segments shorter than this

    //Iterate by lines in MultiLineString
    for (let i = 0, linesLength = coords.length; i < linesLength; i++) {
      const points = coords[i].map(projectPointFunction);

      //Iterate by points in line
      for (let j = 0, pointsLen = points.length; j < pointsLen; j++) {
        const point = points[j];

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

          point[0] = point[0] + pad * dx / dist;
          point[1] = point[1] + pad * dy / dist;
        }

        if (j === 0) {
          ctx.moveTo(point[0], point[1]);
          if (dashes) {
            ctx.setLineDash(dashes);
          } else {
            ctx.setLineDash([]);
          }
        } else {
          ctx.lineTo(point[0], point[1]);
        }
      }
    }
  }
};
