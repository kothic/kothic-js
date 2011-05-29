var MapCSS = (function() {
    var MapCSS = {
        styles: {},
        currentStyle: '',
        onError: function(e){}
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
    
    MapCSS.loadStyle = function(style, restyle, images) {
        MapCSS.styles[style] = {
            restyle: restyle,
            images: images
        };
        
        if (!MapCSS.currentStyle) {
            MapCSS.currentStyle = style;
        }
    };
    
    MapCSS.loadImages = function(style, url) {
        var img = new Image();
        img.onload = function() {
            var images = MapCSS.styles[style].images;
            for(var image in images) {
                if (images.hasOwnProperty(image)) {
                    images[image].sprite = img;
                }
            }
        };
        
        img.onerror = function(e) {
            MapCSS.onError(e);
        };        

        img.src = url;
    };
    
    MapCSS.getImage = function(ref) {
        return MapCSS.styles[MapCSS.currentStyle].images[ref];
    };
    
    MapCSS.restyle = function() {
        return MapCSS.styles[MapCSS.currentStyle].restyle;
    };
    
    return MapCSS;
})();    
