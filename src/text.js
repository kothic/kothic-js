
Kothic.textOnPath = function(ctx, points, text, halo, collisions) {
	var i, j, numIter,
		len = points.length,
		letter,
		letterWidths = {},
		textWidth = ctx.measureText(text).width,
		textLen = text.length;

	// cache letter widths
	for (i = 0; i < textLen; i++) { 
		letter = text.charAt(i);
		if (!letterWidths[letter]) {
			letterWidths[letter] = ctx.measureText(letter).width;
		}
	}

	//points = ST_Simplify(points, 1);
	var pathLen = ST_Length(points);

	if (pathLen < textWidth) return;  // if label won't fit - don't try to

	var widthUsed,
		prevAngle,
		positions,
		solution = 0,
		flipCount,
		flipped = false,
		axy,
		letterWidth;

	// iterating solutions - start from center or from one of the ends
	while (solution < 2) { //TODO change to for?
		widthUsed = solution ? letterWidths[text.charAt(0)] : (pathLen - textWidth) / 2; // ???
		flipCount = 0;
		prevAngle = null;
		positions = [];

		// iterating label letter by letter (should be fixed to support ligatures/CJK, ok for Cyrillic/latin)
		for (i = 0; i < textLen; i++) {
			axy = ST_AngleAndCoordsAtLength(points, widthUsed);

			 // if cannot fit letter - restart with next solution
			if (widthUsed >= pathLen || !axy) {
				solution++;
				positions = [];
				if (flipped) {  // if label was flipped, flip it back
					points.reverse();
					flipped = false;
				}
				break;
			}

			if (!prevAngle) prevAngle = axy[0];

			letter = text.charAt(i);
			letterWidth = letterWidths[letter];

			// if label collisions with another, restart it from here
			if (collisions.checkPointWH([axy[1], axy[2]], 2.5 * letterWidth, 2.5 * letterWidth) ||
					Math.abs(prevAngle - axy[0]) > 0.2) {
				widthUsed += letterWidth;
				i = -1;
				positions = [];
				flipCount = 0;
				continue;
			}

			while (letterWidth < axy[3] && i < textLen){ // try adding following letters to current, until line changes its direction
				i++;
				letter += text.charAt(i);
				if (!letterWidths[letter]) {
					letterWidths[letter] = ctx.measureText(letter).width;
				}
				letterWidth = letterWidths[letter];
				if (  // FIXME: we shouldn't check the whole cluster as one bbox, but rather iterate letter-by-letter
						collisions.checkPointWH([axy[1]+0.5*Math.cos(axy[0])*letterWidth,
						                       axy[2]+0.5*Math.sin(axy[0])*letterWidth],
						                       2.5*letterWidth, 2.5*letterWidth)
						                       || Math.abs(prevAngle - axy[0]) > 0.2) {
					i = 0;
					widthUsed += letterWidth;
					positions = [];
					flipCount = 0;
					letter = text.charAt(i);
					letterWidth = letterWidths[letter];
					axy = ST_AngleAndCoordsAtLength(points, widthUsed);
					break;
				}
			}
			if (!axy) continue;
			if ((axy[0] > (Math.PI / 2)) || (axy[0] < (-Math.PI / 2))) { // if current letters cluster was upside-down, count it
				flipCount += letter.length;
			}

			prevAngle = axy[0];
			axy.push(letter);
			positions.push(axy);
			widthUsed += letterWidth;
		}
		if (flipCount > textLen / 2) { // if more than half of the text is upside down, flip it and restart
			points.reverse();
			positions = [];

			if (flipped) { // if it was flipped twice - restart with other start point solution
				solution++;
				points.reverse();
				flipped = false;
			} else {
				flipped = true;
			}
		}
		if (solution >= 2) return;
		if (positions.length > 0) break;
		flipCount = 0;

		numIter++;
		if (numIter >= 10) return;
	}

	var posLen = positions.length;

	for (i = 0; halo && (i < posLen); i++) {
		axy = positions[i];
		letter = axy[4];
		letterWidth = letterWidths[letter];

		ctx.save();

		ctx.translate(Math.floor(axy[1]+ 0.5 * Math.cos(axy[0]) * letterWidth), Math.floor(axy[2] + 0.5 * Math.sin(axy[0]) * letterWidth));
		ctx.rotate(axy[0]);

		ctx.strokeText(letter, 0, 0);
		ctx.restore();
	}

	for (i = 0; i < posLen; i++) {
		axy = positions[i];
		letter = axy[4];
		letterWidth = letterWidths[letter];

		ctx.save();
		//ctx.textAlign="left";


		ctx.translate(Math.floor(axy[1]+0.5*  Math.cos(axy[0]) * letterWidth), Math.floor(axy[2]+0.5*  Math.sin(axy[0]) * letterWidth));
		//ctx.translate(Math.floor(axy[1]), Math.floor(axy[2]));

		ctx.rotate(axy[0]);

		collisions.addPointWH([
			axy[1] + 0.5 * Math.cos(axy[0]) * letterWidth,
			axy[2] + 0.5 * Math.sin(axy[0]) * letterWidth ],
				2.5 * letterWidth, 2.5 * letterWidth);
		//collisions.addPointWH([axy[1],axy[2]],2.5*letterwidth+20,2.5*letterwidth+20);
		//letter = "["+letter+"]";

		ctx.fillText(letter, 0, 0);
		//ctx.beginPath();
		//ctx.arc(0, 0, 3, 0, Math.PI*2, true);
		//ctx.fillText(parseInt(axy[3]), 0, 0);
		//ctx.fill();
		ctx.restore();
	}
};