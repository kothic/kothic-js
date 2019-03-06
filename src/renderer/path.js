var geom = require('../utils/geom');

/**
 ** Render features on Canvas
 **/

//TODO: split configuration and call
module.exports = function(ctx, geometry, dashes, fill, projectPointFunction, tile_width, tile_height) {
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

  var i, j, k,
      points,
      len = coords.length,
      len2, pointsLen,
      prevPoint, point, screenPoint,
      dx, dy, dist;

  if (type === "MultiPolygon") {
    //Iterate by Polygons in MultiPolygon
    for (i = 0; i < len; i++) {
      //Iterate by Rings of the Polygon
      for (k = 0, len2 = coords[i].length; k < len2; k++) {
        points = coords[i][k];
        pointsLen = points.length;
        prevPoint = points[0];

        //Iterate by points
        for (j = 0; j <= pointsLen; j++) {
          //Close the ring from last to first point
          point = points[j] || points[0];

          screenPoint = projectPointFunction(point);
          //Start drawing from first point
          if (j === 0) {
            ctx.moveTo(screenPoint[0], screenPoint[1]);

            if (dashes) {
              ctx.setLineDash(dashes);
            } else {
              ctx.setLineDash([]);
            }
          } else if (!fill && geom.checkSameBoundary(point, prevPoint, tile_width, tile_height)) {
            // Don't draw lines on tile boundaries
            ctx.moveTo(screenPoint[0], screenPoint[1]);
          } else {
            // Draw a line or filling contour
            ctx.lineTo(screenPoint[0], screenPoint[1]);
          }

          prevPoint = point;
        }
      }
    }
  } else if (type === "MultiLineString") {
    //TODO: Those constants MUST be configured un upper design level
    var pad = 50, // how many pixels to draw out of the tile to avoid path edges when lines crosses tile borders
        skip = 2; // do not draw line segments shorter than this

    //Iterate by lines in MultiLineString
    for (i = 0; i < len; i++) {
      points = coords[i];
      pointsLen = points.length;

      //Iterate by points in line
      for (j = 0; j < pointsLen; j++) {
        point = points[j];

        // continue path off the tile by some amount to fix path edges between tiles
        if ((j === 0 || j === pointsLen - 1) && geom.isOnTileBoundary(point, tile_width, tile_height)) {
          k = j;
          do {
            k = j ? k - 1 : k + 1;
            if (k < 0 || k >= pointsLen) {
              break;
            }

            prevPoint = points[k];

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

        screenPoint = projectPointFunction(point);

        if (j === 0) {
          ctx.moveTo(screenPoint[0], screenPoint[1]);
          if (dashes) {
            ctx.setLineDash(dashes);
          } else {
            ctx.setLineDash([]);
          }
        } else {
          ctx.lineTo(screenPoint[0], screenPoint[1]);
        }
      }
    }
  }
};
