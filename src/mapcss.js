
var MapCSS = {
    styles: {},
    currentStyle: '',
    onError: function(e) {},
    onImagesLoad: function() {}
};

MapCSS.e_min = function(/*...*/) {
    return Math.min.apply(null, arguments);
};

MapCSS.e_max = function(/*...*/) {
    return Math.max.apply(null, arguments);
};

MapCSS.e_any = function(/*...*/) {
    for(var i = 0; i < arguments.length; i++) {
        if (typeof(arguments[i]) != 'undefined' && arguments[i] !== '') {
            return arguments[i];
        }
    }

    return "";
};

MapCSS.e_num = function(arg) {
    if (!isNaN(parseFloat(arg))) {
        return parseFloat(arg);
    } else {
        return "";
    }
};

MapCSS.e_str = function(arg) {
    return arg;
};

MapCSS.e_int = function(arg) {
    return parseInt(arg, 10);
};

MapCSS.e_tag = function(a, tag) {
    if (tag in a && a[tag] !== null) {
        return a[tag];
    } else {
        return "";
    }
};

MapCSS.e_prop = function(obj, tag) {
    if (tag in obj && obj[tag] !== null) {
        return obj[tag];
    } else {
        return "";
    }
};

MapCSS.e_sqrt = function(arg) {
    return Math.sqrt(arg);
};

MapCSS.e_boolean = function(arg) {
    if (arg == '0' || arg == 'false' || arg === '') {
        return 'false';
    } else {
        return 'true';
    }
};

MapCSS.e_boolean = function(arg, if_exp, else_exp) {
    if (MapCSS.e_boolean(arg) == 'true') {
        return if_exp;
    } else {
        return else_exp;
    }
};

MapCSS.e_metric = function(arg) {
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
};

MapCSS.e_zmetric = function(arg) {
    return MapCSS.metric(arg);
};

MapCSS.loadStyle = function(style, restyle, sprite_images, external_images) {
    MapCSS.styles[style] = {
        restyle: restyle,
        images: sprite_images,
        external_images: external_images,
        textures: {}
    };

    if (!MapCSS.currentStyle) {
        MapCSS.currentStyle = style;
    }
};

MapCSS.loadImages = function(style, url) {
    var sprite_loaded = !url,
		external_images_loaded = !MapCSS.styles[style].external_images.length;

	//MapCSS doesn't have any images
	if (external_images_loaded && sprite_loaded) {
		MapCSS.onImagesLoad();
	}

	if (!external_images_loaded) {
		MapCSS._preloadExternalImages(style, function() {
			external_images_loaded = true;
			if (external_images_loaded && sprite_loaded) {
				MapCSS.onImagesLoad();
			}
		});
	}

	if (!sprite_loaded) {
		MapCSS._preloadSpriteImage(style, url, function () {
			sprite_loaded = true;
			if (external_images_loaded && sprite_loaded) {
				MapCSS.onImagesLoad();
			}
		});
	}
};

MapCSS._preloadSpriteImage = function(style, url, /* callback function */ onLoad) {
	var img = new Image();
	img.onload = function() {
		var images = MapCSS.styles[style].images;
		for(var image in images) {
			if (images.hasOwnProperty(image)) {
				images[image].sprite = img;
			}
		}
		onLoad();
	};
    img.onerror = function(e) {
        MapCSS.onError(e);
    };
	img.src = url;
};


MapCSS._preloadExternalImages = function(style, /* callback function */ onLoad) {
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
					onLoad();
				}
			};
			img.onerror = function() {
				loaded++;
				if (loaded == len) {
					onLoad();
				}
			};
			img.src = url;
		})(external_images[i]);
	}
};

MapCSS.getImage = function(ref) {
    return MapCSS.styles[MapCSS.currentStyle].images[ref];
};

MapCSS.getImageAsTexture = function(ref) {
	var style = MapCSS.styles[MapCSS.currentStyle];
	if (!(ref in style.textures)) {
		var img = MapCSS.styles[MapCSS.currentStyle].images[ref];
		var canvas = document.createElement('canvas');
		if (img){
			canvas.width = img.width;
			canvas.height = img.height;
			canvas.getContext("2d").drawImage(img.sprite,
				0, img.offset, img.width, img.height,
				0, 0,
				img.width, img.height);
		}
		style.textures[ref] = canvas;
	}

	return style.textures[ref];
};

MapCSS.restyle = function() {
    return MapCSS.styles[MapCSS.currentStyle].restyle.apply(MapCSS, arguments);
};
