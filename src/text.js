
Kothic.textOnPath = function(ctx, points, text, halo, collisions) {
	var i, j, numIter,
		len = points.length,
		letter,
		textWidth = ctx.measureText(text).width,
		textLen = text.length,
		numIter = 0;

	var getWidth = (function() {
		var widthCache = {};
		return function(text) {
			if (!widthCache[text]) {
				widthCache[text] = ctx.measureText(letter).width;
			}
			return widthCache[text];
		};
	})();
	
	function getTextCenter(axy, textWidth) {
		return [axy[1] + 0.5 * Math.cos(axy[0]) * textWidth, 
		        axy[2] + 0.5 * Math.sin(axy[0]) * textWidth];
	}
	
	function getCollisionParams(text, axy) {
		var textWidth = getWidth(text),
			textHeight = getWidth(text.charAt(0)) * 2.5,
			angle = axy[0],
			w = Math.abs(Math.cos(angle) * textWidth) + Math.abs(Math.sin(angle) * textHeight),
			h = Math.abs(Math.sin(angle) * textWidth) + Math.abs(Math.cos(angle) * textHeight);
	
		return [getTextCenter(axy, textWidth), w, h];
	}
	
	function checkCollision(text, axy) {
		return collisions.checkPointWH.apply(collisions, getCollisionParams(text, axy));
	}
	
	function addCollision(text, axy) {
		return collisions.addPointWH.apply(collisions, getCollisionParams(text, axy));
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
		widthUsed = solution ? getWidth(text.charAt(0)) : (pathLen - textWidth) / 2; // ???
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
			letterWidth = getWidth(letter);

			// if label collisions with another, restart it from here
			if (checkCollision(letter, axy) || Math.abs(prevAngle - axy[0]) > 0.2) {
				widthUsed += letterWidth;
				i = -1;
				positions = [];
				flipCount = 0;
				continue;
			}

			while (letterWidth < axy[3] && i < textLen){ // try adding following letters to current, until line changes its direction
				i++;
				letter += text.charAt(i);
				letterWidth = getWidth(letter);
				
				// FIXME: we shouldn't check the whole cluster as one bbox, but rather iterate letter-by-letter
				if (checkCollision(letter, axy) || Math.abs(prevAngle - axy[0]) > 0.2) {
					i = 0;
					widthUsed += letterWidth;
					positions = [];
					flipCount = 0;
					letter = text.charAt(i);
					letterWidth = getWidth(letter);
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
		if (numIter >= 10) debugger;
	}

	var posLen = positions.length;

	for (i = 0; halo && (i < posLen); i++) {
		axy = positions[i];
		letter = axy[4];
		letterWidth = getWidth(letter),
		letterCenter = getTextCenter(axy, letterWidth);

		ctx.save();

		ctx.translate(Math.floor(letterCenter[0]), Math.floor(letterCenter[1]));
		ctx.rotate(axy[0]);

		ctx.strokeText(letter, 0, 0);
		ctx.restore();
	}

	for (i = 0; i < posLen; i++) {
		axy = positions[i];
		letter = axy[4];
		letterWidth = getWidth(letter),
		letterCenter = getTextCenter(axy, letterWidth);

		ctx.save();

		ctx.translate(Math.floor(letterCenter[0]), Math.floor(letterCenter[1]));
		ctx.rotate(axy[0]);

		ctx.fillText(letter, 0, 0);
		
		ctx.restore();
		
		addCollision(letter, axy);
	}
};