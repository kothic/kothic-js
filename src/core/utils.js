/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

K = {};

K.Utils = {
	setOptions: function (obj, options) {
		obj.options = K.Utils.extend({}, obj.options, options);
	},    

	extend: function (/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
		var sources = Array.prototype.slice.call(arguments, 1), len = sources.length, 
            i, j, src;
		for (j = 0; j < len; j++) {
			src = sources[j] || {};
			for (i in src) {
				if (src.hasOwnProperty(i)) {
					dest[i] = src[i];
				}
			}
		}
		return dest;
	},
    
    isEmpty: function (obj) {
        var key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }

        return true;        
    }
};
