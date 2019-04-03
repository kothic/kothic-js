'use strict';

const colors = require('../utils/colors.js');

function deg(rad) {
	return rad * 180 / Math.PI;
}

function rad(deg) {
	return deg * Math.PI / 180;
}

function quadrant(angle) {
  if (angle < Math.PI / 2 && angle > -Math.PI / 2)  {
    return '1,3';
  } else {
    return '2,4';
  }
}

function createSegments(points) {
  const segments = [];
  //TODO: Make this angle configurable
  const maxSegmentAngle = rad(45);

  // Offset of each segment from the beginning og the line
  var offset = 0;
  for (var i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];

    const dx = end[0] - start[0];
    const dy = end[1] - start[1];

    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx ** 2 + dy ** 2);

    // Try to attach current point to a previous segment
    if (segments.length > 0) {
      const prevSegment = segments[segments.length - 1];
      const prevAngle = prevSegment.angles[prevSegment.angles.length - 1];

      // Angles more than 180 degrees are reversed to different direction
      var angleDiff = Math.abs(prevAngle - angle);
      if (angleDiff > Math.PI) {
        angleDiff = (2 * Math.PI) - angleDiff;
      }

      // The segment can be continued, if
      // 1. Angle between two parts is lesser then maxSegmentAngle to avoid sharp corners
      // 2. Part is direcred to the same hemicircle as the previous segment
      //
      // Otherwise, the new segment will be created
      if (angleDiff < maxSegmentAngle && quadrant(angle) == prevSegment.quadrant) {
        prevSegment.points.push(end);
        prevSegment.angles.push(angle);
        prevSegment.partsLength.push(length);
        prevSegment.length += length;
        offset += length;
        continue;
      }
    }

    segments.push({
      angles: [angle],
      partsLength: [length],
      offset: offset,
      length: length,
      points: [start, end],
      quadrant: quadrant(angle)
    });

    offset += length;
  }

  return segments;
}

/** Find index of segemnt part and offset from beginning of the part by offset.
 ** This method is used to put label to the center of a segment
 ** @param parts {array} array of segment parts length
 ** @param offset {float} expected offset
 **/
function calculateOffset(parts, offset) {
  var totalOffset = 0;

  for (var i = 0; i < parts.length; i++) {
    const part = parts[i];

    if (totalOffset + part > offset) {
      return [i, offset - totalOffset];
    } else {
      totalOffset += part;
    }
  }

  throw new Error("Sanity check: path is shorter than an offset");
}

function drawGlyph(ctx, offsetX, offsetY, glyph, point, angle) {
  ctx.translate(point[0], point[1]);
  ctx.rotate(angle);
  //ctx.strokeText(glyph.glyph, offsetX, offsetY);
  ctx.fillText(glyph.glyph, offsetX, offsetY);
  ctx.rotate(-angle);
  ctx.translate(-point[0], -point[1]);
}

function renderSegments(ctx, segments) {
  ctx.save();
  segments.forEach((seg) => {
    ctx.strokeStyle = colors.nextColor();
    ctx.lineWidth = 3;
    ctx.beginPath()
    ctx.moveTo(seg.points[0][0], seg.points[0][1]);
    for (var i = 1; i < seg.points.length; i++) {
      ctx.lineTo(seg.points[i][0], seg.points[i][1]);
    }
    ctx.stroke();
  });
  ctx.restore();
}

function renderText(ctx, segment, glyphs) {
  const textWidth = glyphs.reduce((acc, glyph) => acc + glyph.width, 0);

  //Reverse segment to avoid text, flipped upside down
  if (segment.quadrant == '2,4') {
    segment.angles = segment.angles.map((angle) => Math.PI - angle);
    segment.partsLength.reverse();
    segment.points.reverse();
  }

  const startOffset = (segment.length - textWidth) / 2;

  const parts = segment.partsLength;

  var [index, offset] = calculateOffset(parts, startOffset);
  for (var i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];

    var reserved = 0;
    const point = segment.points[index];
    const angle = segment.angles[index];
    const offsetX = offset;

    while (reserved < glyph.width) {
      const required = glyph.width - reserved;
      if (parts[index] > offset + required) {
        offset += required;
        reserved += required;
        break;
      }
      //TODO: Adjust angle
      const prevReminder = parts[index] - offset;
      reserved += prevReminder;
      index += 1;
      offset = 0;
    }

    drawGlyph(ctx, offsetX, 0, glyph, point, angle);
  }
}

function render(ctx, points, text, debug=false) {
  const glyphs = text.split("")
      .map((l) => {
        const metrics = ctx.measureText(l);
        return {
          glyph: l,
          width: metrics.width,
          ascent: metrics.emHeightAscent,
          descent: metrics.emHeightDescent,
        }
      });

  const textWidth = glyphs.reduce((acc, glyph) => acc + glyph.width, 0);

  var segments = createSegments(points);

  if (debug) {
    renderSegments(ctx, segments);
  }

  segments = segments.filter((seg) => seg.length > textWidth);
  //TODO: Merge first and last segments if possible

  //TODO Choose best segments

  //Render text
  segments.forEach((seg) => renderText(ctx, seg, glyphs));
}

module.exports.render = render;
