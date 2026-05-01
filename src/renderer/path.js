
Kothic.path = (function () {
    // check if the point is on the tile boundary
    // returns bitmask of affected tile boundaries
    function isTileBoundary(p, size) {
        var r = 0;
        /*jslint bitwise: true */
        if (p[0] === 0) {
            r |= 1;
        }
        else if (p[0] === size) {
            r |= 2;
        }
        if (p[1] === 0) {
            r |= 4;
        }
        else if (p[1] === size) {
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
     * This does not catch the case where the object is indeed exactly
     * on the tile boundaries, but this case can't properly be detected here.
     */
    function checkSameBoundary(p, q, size) {
        var bp = isTileBoundary(p, size);
        if (!bp) {
            return 0;
        }
        /*jslint bitwise: true */
        return (bp & isTileBoundary(q, size));
    }

    return function (ctx, feature, dashes, fill, ws, hs, granularity) {
        var type = feature.type,
            coords = feature.coordinates;

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
            for (i = 0; i < len; i++) {
                for (k = 0, len2 = coords[i].length; k < len2; k++) {
                    points = coords[i][k];
                    pointsLen = points.length;
                    prevPoint = points[0];

                    for (j = 0; j <= pointsLen; j++) {
                        point = points[j] || points[0];
                        screenPoint = Kothic.geom.transformPoint(point, ws, hs);

                        if (j === 0) {
                            ctx.moveTo(screenPoint[0], screenPoint[1]);
                            if (dashes) {
                                ctx.setLineDash(dashes);
                            }
                            else {
                                ctx.setLineDash([]);
                            }
                        } else if (!fill && checkSameBoundary(point, prevPoint, granularity)) {
                            ctx.moveTo(screenPoint[0], screenPoint[1]);
                        } else {
                            ctx.lineTo(screenPoint[0], screenPoint[1]);
                        }
                        prevPoint = point;
                    }
                }
            }
        } else if (type === "MultiLineString") {
            var pad = 50, // how many pixels to draw out of the tile to avoid path edges when lines crosses tile borders
                skip = 2; // do not draw line segments shorter than this

            for (i = 0; i < len; i++) {
                points = coords[i];
                pointsLen = points.length;

                for (j = 0; j < pointsLen; j++) {
                    point = points[j];

                    // continue path off the tile by some amount to fix path edges between tiles
                    if ((j === 0 || j === pointsLen - 1) && isTileBoundary(point, granularity)) {
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
                    screenPoint = Kothic.geom.transformPoint(point, ws, hs);

                    if (j === 0) {
                        ctx.moveTo(screenPoint[0], screenPoint[1]);
                        if (dashes) {
                            ctx.setLineDash(dashes);
                        }
                        else {
                            ctx.setLineDash([]);
                        }
                    } else {
                        ctx.lineTo(screenPoint[0], screenPoint[1]);
                    }
                }
            }
        }
    };
}());
