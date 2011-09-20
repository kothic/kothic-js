/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

/**
 * Dummy in-memory implementation.
 */
Kothic.Cache = new function() {
	this.cache = [];

	function key(x, y, zoom) {
		return [x, y, zoom].join(":");
	}

	this.put = function (x, y, zoom, data) {
		this.cache[key(x, y, zoom)] = data;
	}

	this.get = function (x, y, zoom, hit_callback, miss_callback) {
		if (this.cache.hasOwnProperty(key(x, y, zoom))) {
			hit_callback(this.cache[key(x, y, zoom)]);
		} else {
			miss_callback(x, y, zoom);
		}
	}
}