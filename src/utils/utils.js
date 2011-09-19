/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Kothic.utils = {
	transformPoint: function (point, ws, hs) {
		return [ws * point[0], hs * point[1]];
	},

	transformPoints: function (points, ws, hs) {
		var transformed = [], i;
		for (i = 0, len = points.length; i < len; i++) {
			transformed.push(this.transformPoint(points[i], ws, hs));
		}
		return transformed;
	},

	getReprPoint: function (feature) {
		var point, len;
		switch (feature.type) {
			case 'Point':
				point = feature.coordinates;
				break;
			case 'Polygon':
				point = feature.reprpoint;
				break;
			case 'LineString':
				len = Kothic.geomops.getPolyLength(feature.coordinates);
				point = Kothic.geomops.getAngleAndCoordsAtLength(feature.coordinates, len / 2, 0);
				point = [point[1], point[2]];
				break;
			case 'GeometryCollection':
				//TODO: Disassemble geometry collection
				return;
			case 'MultiPoint':
				//TODO: Disassemble multi point
				return;
			case 'MultiPolygon':
				point = feature.reprpoint;
				break;
			case 'MultiLineString':
				//TODO: Disassemble geometry collection
				return;
		}
		return point;
	},

    getOrderedKeys: function (dict) {
        var keys = [], key;
        for (key in dict) {
            if (dict.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        
        keys.sort();
        return keys;
    },
    
	extend: function (dest, source) {
        var key;
		for (key in source) {
			if (source.hasOwnProperty(key)) {
				dest[key] = source[key];
			}
		}
		return dest;
	},

	remove_from_array: function(arr, elem) {
     	var index = arr.indexOf(elem);
     	if (index >= 0) {
        	arr.splice(index, 1);
    	}
	}	
};

