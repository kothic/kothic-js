var MapCSS = {
    styles: {},
    currentStyle: '',
    onError: function(e) {},
    onImagesLoad: function() {},
    
    e_min: function(/*...*/) {
	    return Math.min.apply(null, arguments);
	},

	e_max: function(/*...*/) {
		return Math.max.apply(null, arguments);
	},

	e_any: function(/*...*/) {
	    for(var i = 0; i < arguments.length; i++) {
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

	e_boolean: function(arg) {
	    if (arg == '0' || arg == 'false' || arg === '') {
	        return 'false';
	    } else {
	        return 'true';
	    }
	},

	e_boolean: function(arg, if_exp, else_exp) {
	    if (MapCSS.e_boolean(arg) == 'true') {
	        return if_exp;
	    } else {
	        return else_exp;
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
	
	    if (!MapCSS.currentStyle) {
	        MapCSS.currentStyle = style;
	    }
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
		var img = new Image();
		img.onload = function() {
			var images = MapCSS.styles[style].images;
			for(var image in images) {
				if (images.hasOwnProperty(image)) {
					images[image].sprite = img;
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
					MapCSS.styles[style].images[url] = {
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
		var style = MapCSS.styles[MapCSS.currentStyle],
			img = style.images[ref];
		
		if (img.sprite) {
			var canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			
			canvas.getContext("2d").drawImage(img.sprite,
				0, img.offset, img.width, img.height, 
				0, 0, img.width, img.height);
			
			img = style.images[ref] = canvas;
		}
	
		return img;
	},

	restyle: function() {
	    return MapCSS.styles[MapCSS.currentStyle].restyle.apply(MapCSS, arguments);
	}
};
