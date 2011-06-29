var MapCSS = {
	styles: {},
	currentStyles: [],
	images: {},

	onError: function(e) {
	},

	onImagesLoad: function() {
	},

	e_min: function(/*...*/) {
		return Math.min.apply(null, arguments);
	},

	e_max: function(/*...*/) {
		return Math.max.apply(null, arguments);
	},

	e_any: function(/*...*/) {
		for (var i = 0; i < arguments.length; i++) {
			if (typeof(arguments[i]) != 'undefined' && arguments[i] !== '') {
				return arguments[i];
			}
		}

		return "";
	},

	e_num: function(arg) {
		if (!isNaN(parseFloat(arg))) {
			return parseFloat(arg);
		} else {
			return "";
		}
	},

	e_str: function(arg) {
		return arg;
	},

	e_int: function(arg) {
		return parseInt(arg, 10);
	},

	e_tag: function(a, tag) {
		if (tag in a && a[tag] !== null) {
			return a[tag];
		} else {
			return "";
		}
	},

	e_prop: function(obj, tag) {
		if (tag in obj && obj[tag] !== null) {
			return obj[tag];
		} else {
			return "";
		}
	},

	e_sqrt: function(arg) {
		return Math.sqrt(arg);
	},

	e_boolean: function(arg, if_exp, else_exp) {
		if (typeof(if_exp) == 'undefined') {
			if_exp = 'true';
		}

		if (typeof(else_exp) == 'undefined') {
			else_exp = 'false';
		}

		if (arg == '0' || arg == 'false' || arg === '') {
			return else_exp;
		} else {
			return if_exp;
		}
	},

	e_metric: function(arg) {
		if (/\d\s*mm$/.test(arg)) {
			return 1000 * parseInt(arg, 10);
		} else if (/\d\s*cm$/.test(arg)) {
			return 100 * parseInt(arg, 10);
		} else if (/\d\s*dm$/.test(arg)) {
			return 10 * parseInt(arg, 10);
		} else if (/\d\s*km$/.test(arg)) {
			return 0.001 * parseInt(arg, 10);
		} else if (/\d\s*in$/.test(arg)) {
			return 0.0254 * parseInt(arg, 10);
		} else if (/\d\s*ft$/.test(arg)) {
			return 0.3048 * parseInt(arg, 10);
		} else {
			return parseInt(arg, 10);
		}
	},

	e_zmetric: function(arg) {
		return MapCSS.metric(arg);
	},

	loadStyle: function(style, restyle, sprite_images, external_images) {
		MapCSS.styles[style] = {
			restyle: restyle,
			images: sprite_images,
			external_images: external_images,
			textures: {},
			sprite_loaded: !sprite_images,
			external_images_loaded: !external_images.length
		};

		MapCSS.currentStyles.push(style);
	},

	/**
	 * Call MapCSS.onImagesLoad callback if all sprite and external
	 * images was loaded
	 */
	_onImagesLoad: function(style) {
		if (MapCSS.styles[style].external_images_loaded &&
				MapCSS.styles[style].sprite_loaded) {
			MapCSS.onImagesLoad();
		}
	},

	preloadSpriteImage: function(style, url) {
		var images = MapCSS.styles[style].images;
		delete MapCSS.styles[style].images;
		var img = new Image();
		img.onload = function() {
			for (var image in images) {
				if (images.hasOwnProperty(image)) {
					images[image].sprite = img;
					MapCSS.images[image] = images[image];
				}
			}
			MapCSS.styles[style].sprite_loaded = true;
			MapCSS._onImagesLoad(style);
		};
		img.onerror = function(e) {
			MapCSS.onError(e);
		};
		img.src = url;
	},

	preloadExternalImages: function(style) {
		var external_images = MapCSS.styles[style].external_images;
		delete MapCSS.styles[style].external_images;

		var len = external_images.length, loaded = 0;
		for (var i = 0; i < len; i++) {
			(function(url) {
				var img = new Image();
				img.onload = function() {
					loaded++;
					MapCSS.images[url] = {
						sprite: img,
						height: img.height,
						width: img.width,
						offset: 0
					};
					if (loaded == len) {
						MapCSS.styles[style].external_images_loaded = true;
						MapCSS._onImagesLoad(style);
					}
				};
				img.onerror = function() {
					loaded++;
					if (loaded == len) {
						MapCSS.styles[style].external_images_loaded = true;
						MapCSS._onImagesLoad(style);
					}
				};
				img.src = url;
			})(external_images[i]);
		}
	},

	getImage: function(ref) {
		var img = MapCSS.images[ref];

		if (img.sprite) {
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;

			canvas.getContext("2d").drawImage(img.sprite,
					0, img.offset, img.width, img.height,
					0, 0, img.width, img.height);

			img = MapCSS.images[ref] = canvas;
		}

		return img;
	},

	restyle: function(style, tags, zoom, type, selector) {
		var styleName;
		for (var i = 0; i < MapCSS.currentStyles.length; i++) {
			styleName = MapCSS.currentStyles[i];
			style = MapCSS.styles[styleName].restyle(style, tags, zoom, type, selector);
		}

		return style;
	}
};
