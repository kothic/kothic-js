function ST_Simplify( points, tolerance ) {
	
	// helper classes
	var Vector = function( x, y ) {
		this.x = x;
		this.y = y;
		
	};
	var Line = function( p1, p2 ) {
		this.p1 = p1;
		this.p2 = p2;
		
		this.distanceToPoint = function( point ) {
			// slope
			var m = ( this.p2.y - this.p1.y ) / ( this.p2.x - this.p1.x );
			// y offset
			var b = this.p1.y - ( m * this.p1.x );
			var d = [];
			// distance to the linear equation
			d.push( Math.abs( point.y - ( m * point.x ) - b ) / Math.sqrt( Math.pow( m, 2 ) + 1 ) );
			// distance to p1
			d.push( Math.sqrt( Math.pow( ( point.x - this.p1.x ), 2 ) + Math.pow( ( point.y - this.p1.y ), 2 ) ) );
			// distance to p2
			d.push( Math.sqrt( Math.pow( ( point.x - this.p2.x ), 2 ) + Math.pow( ( point.y - this.p2.y ), 2 ) ) );
			// return the smallest distance
			return d.sort( function( a, b ) {
				return ( a - b ); //causes an array to be sorted numerically and ascending
			} )[0];
		};
	};
	
	var douglasPeucker = function( points, tolerance ) {
		var returnPoints = [];
		if ( points.length <= 2 ) {
			return [points[0]];
		}
		// make line from start to end
		var line = new Line( points[0], points[points.length - 1] );
		// find the largest distance from intermediate poitns to this line
		var maxDistance = 0;
		var maxDistanceIndex = 0;
		for( var i = 1; i <= points.length - 2; i++ ) {
			var distance = line.distanceToPoint( points[ i ] );
			if( distance > maxDistance ) {
				maxDistance = distance;
				maxDistanceIndex = i;
			}
		}
		// check if the max distance is greater than our tollerance allows
		if ( maxDistance >= tolerance ) {
			var p = points[maxDistanceIndex];
			line.distanceToPoint( p, true );
			// include this point in the output
			returnPoints = returnPoints.concat( douglasPeucker( points.slice( 0, maxDistanceIndex + 1 ), tolerance ) );
			// returnPoints.push( points[maxDistanceIndex] );
			returnPoints = returnPoints.concat( douglasPeucker( points.slice( maxDistanceIndex, points.length ), tolerance ) );
		} else {
			// ditching this point
			var p = points[maxDistanceIndex];
			line.distanceToPoint( p, true );
			returnPoints = [points[0]];
		}
		return returnPoints;
	};
	var arr = douglasPeucker( points, tolerance );
	// always have to push the very last point on so it doesn't get left off
	arr.push( points[points.length - 1 ] );
	return arr;
};


function ST_AngleAndCoordsAtLength(geom, len){
	var length = 0;
	var seglen = 0;
	var x,y,p,l;
	var pc = geom[0];
	//alert(len);
	for (c in geom){
		c = geom[c];
		if (c==pc) continue;
		seglen = Math.sqrt(((pc[0]-c[0])*(pc[0]-c[0]))+((pc[1]-c[1])*(pc[1]-c[1])));
		if ((length+seglen)>=len){
			length = len - length;
			x = (c[0]-pc[0])*length/seglen + pc[0]; //x on length
			y = (c[1]-pc[1])*length/seglen + pc[1]; //y on length
			p = Math.atan2(c[1]-pc[1],c[0]-pc[0]);  // angle on length
			l = Math.sqrt(((x-c[0])*(x-c[0]))+((y-c[1])*(y-c[1]))); // how many pixels left with same angle
			return [p,x,y,l];
		}
		pc=c;
		length += seglen;
	}
}

function ST_Length(geom){ // length for a line formed by coordinates array
	var length = 0;
	var pc = geom[0];
	for (c in geom){
		c = geom[c];
		length += Math.sqrt((pc[0]-c[0])*(pc[0]-c[0])+(pc[1]-c[1])*(pc[1]-c[1]));
		pc=c;
	}
	return length;
}