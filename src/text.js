
Kothic.textOnPath = (function() {
	var widthCache;
	
	function getWidth(ctx, text) {
		if (!widthCache[text]) {
			widthCache[text] = ctx.measureText(text).width;
		}
		return widthCache[text];
	}

	function getTextCenter(axy, textWidth) {
		return [axy[1] + 0.5 * Math.cos(axy[0]) * textWidth, 
		        axy[2] + 0.5 * Math.sin(axy[0]) * textWidth];
	}
	
	function getCollisionParams(ctx, text, axy) {
		var textWidth = getWidth(ctx, text),
			textHeight = getWidth(ctx, text.charAt(0)) * 2.5,
			angle = axy[0],
			w = Math.abs(Math.cos(angle) * textWidth) + Math.abs(Math.sin(angle) * textHeight),
			h = Math.abs(Math.sin(angle) * textWidth) + Math.abs(Math.cos(angle) * textHeight);
	
		return [getTextCenter(axy, textWidth), w, h, 0];
	}
	
	function checkCollision(collisions, ctx, text, axy) {
		return collisions.checkPointWH.apply(collisions, getCollisionParams(ctx, text, axy));
	}
	
	function addCollision(collisions, ctx, text, axy) {
		return collisions.addPointWH.apply(collisions, getCollisionParams(ctx, text, axy));
	}

	function renderText(ctx, axy, halo) {
		var text = axy[4],
			textCenter = getTextCenter(axy, getWidth(ctx, text));

		ctx.save();

		ctx.translate(Math.floor(textCenter[0]), Math.floor(textCenter[1]));
		ctx.rotate(axy[0]);

		ctx[halo ? 'strokeText' : 'fillText'](text, 0, 0);
		
		ctx.restore();
	}

	return function(ctx, points, text, halo, collisions) {
		widthCache = {};
		
		//points = ST_Simplify(points, 1);
		
		var textWidth = ctx.measureText(text).width,
			textLen = text.length,
			pathLen = ST_Length(points);
		
		if (pathLen < textWidth) return;  // if label won't fit - don't try to
	
		var letter,
			widthUsed,
			prevAngle,
			positions,
			solution = 0,
			flipCount,
			flipped = false,
			axy,
			letterWidth,
			i;
	
		// iterating solutions - start from center or from one of the ends
		while (solution < 2) { //TODO change to for?
			widthUsed = solution ? getWidth(ctx, text.charAt(0)) : (pathLen - textWidth) / 2; // ???
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
				letterWidth = getWidth(ctx, letter);
	
				// if label collisions with another, restart it from here
				if (checkCollision(collisions, ctx, letter, axy) || Math.abs(prevAngle - axy[0]) > 0.2) {
					widthUsed += letterWidth;
					i = -1;
					positions = [];
					flipCount = 0;
					continue;
				}
	
				while (letterWidth < axy[3] && i < textLen){ // try adding following letters to current, until line changes its direction
					i++;
					letter += text.charAt(i);
					letterWidth = getWidth(ctx, letter);
					
					// FIXME: we shouldn't check the whole cluster as one bbox, but rather iterate letter-by-letter
					if (checkCollision(collisions, ctx, letter, axy) || Math.abs(prevAngle - axy[0]) > 0.2) {
						i = 0;
						widthUsed += letterWidth;
						positions = [];
						flipCount = 0;
						letter = text.charAt(i);
						letterWidth = getWidth(ctx, letter);
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
		}
	
		var posLen = positions.length;
	
		for (i = 0; halo && (i < posLen); i++) {
			renderText(ctx, positions[i], true);
		}
	
		for (i = 0; i < posLen; i++) {
			axy = positions[i];
			renderText(ctx, axy);
			addCollision(collisions, ctx, axy[4], axy);
		}
	};
})();