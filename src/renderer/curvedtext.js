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

function drawGlyph(ctx, glyph, hasHalo=false) {
  ctx.translate(glyph.position[0], glyph.position[1]);
  ctx.rotate(glyph.angle);
	if (hasHalo) {
  	ctx.strokeText(glyph.glyph, glyph.offset[0], glyph.offset[1]);
	} else {
		ctx.fillText(glyph.glyph, glyph.offset[0], glyph.offset[1]);
	}

  ctx.rotate(-glyph.angle);
  ctx.translate(-glyph.position[0], -glyph.position[1]);
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

function calculateGlyphsPositions(segment, glyphs) {
  const textWidth = glyphs.reduce((acc, glyph) => acc + glyph.width, 0);

  //Reverse segment to avoid text, flipped upside down
  if (segment.quadrant == '2,4') {
    segment.angles = segment.angles.map((angle) => angle - Math.PI);
    segment.partsLength.reverse();
    segment.points.reverse();
		segment.quadrant = '1,3'
  }

	//Align text to the middle of current segment
  const startOffset = (segment.length - textWidth) / 2;

	// Get point index and offset from that point of the starting position
	// 'index' is an index of current segment partsLength
	// 'offset' is an offset from the beggining of the part
  var [index, offset] = calculateOffset(segment.partsLength, startOffset);
  for (var i = 0; i < glyphs.length; i++) {
    const glyph = glyphs[i];

		const startPointIndex = index;
    const offsetX = offset;

		//Iterate by points until space for current glyph was reserved
		var reserved = 0;
    while (reserved < glyph.width) {
      const requiredSpace = glyph.width - reserved;
			//Current part is longer than required space
      if (segment.partsLength[index] > offset + requiredSpace) {
        offset += requiredSpace;
        reserved += requiredSpace;
        break;
      }

			//Current part is shorter than required space. Reserve the whole part
			//and increment index
      reserved += segment.partsLength[index] - offset;
      index += 1;
      offset = 0;
    }

		// Text glyph may cover multiple segment parts, so a glyph angle should
		// be averaged between start ans end position
		const angle = adjustAngle(segment.points[startPointIndex], segment.angles[startPointIndex], segment.points[index], segment.angles[index], offset, 0);

		glyph.position = segment.points[startPointIndex];
		glyph.angle = angle;
		glyph.offset = [offsetX, 0];
  }

	return glyphs;
}

function adjustAngle(pointStart, angleStart, pointNext, angleNext, offsetX, offsetY) {
	//If glyph can be fitted to a single segment part, no adjustment is needed
	if (pointStart === pointNext) {
		return angleStart;
	}

	//Draw a line from start point to end point of a glyph
	const x = pointNext[0] + offsetX * Math.sin(angleNext) + offsetY * Math.sin(angleNext);
	const y = pointNext[1] + offsetX * Math.cos(angleNext) + offsetY * Math.cos(angleNext);

	//return angle of this line
	return Math.atan2(y - pointStart[1], x - pointStart[0]);
}

function checkCollisions(segment, collisions) {
	const box = segment.points.reduce((acc, point) => ({
			minX: Math.min(acc.minX, point[0]),
			minY: Math.min(acc.minY, point[1]),
			maxX: Math.max(acc.maxX, point[0]),
			maxY: Math.max(acc.maxX, point[1])
		}), {minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity});

		return collisions.check(box);
}

function render(ctx, points, text, hasHalo, collisions, debug=false) {
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

  //TODO: Merge first and last segments if possible

  segments = segments.filter((seg) => seg.length > textWidth);

	segments = segments.filter((seg) => checkCollisions(seg, collisions))


  //TODO Choose best segments

  //Render text
  segments.forEach((seg) => {
		const positions = calculateGlyphsPositions(seg, glyphs);

		if (hasHalo) {
			positions.forEach((glyph) => {
				drawGlyph(ctx, glyph, true);
			});
		}
		positions.forEach((glyph) => {
			drawGlyph(ctx, glyph, false);
		});
	});
}

module.exports.render = render;
