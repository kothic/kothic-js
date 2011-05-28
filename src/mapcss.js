var MapCSS = (function() {
    var MapCSS = {
        styles: {},
        currentStyle: '',
    };
    
    MapCSS.min = function(/*...*/) {
        return Math.min.apply(null, arguments);
    };

    MapCSS.max = function(/*...*/) {
        return Math.max.apply(null, arguments);
    };

    MapCSS.any = function(/*...*/) {
        for(var i = 0; i < arguments.length; i++) {
            if (typeof(arguments[i]) != 'undefined' && arguments[i] != '') {
                return arguments[i];
            }
        }
    
        return "";
    };

    MapCSS.num = function(arg) {
        if (!isNaN(parseFloat(arg))) {
            return parseFloat(arg);
        } else {
            return "";
        }
    };

    MapCSS.str = function(arg) {
        return arg;
    };

    MapCSS.int = function(arg) {
        return parseInt(arg, 10);
    };

    MapCSS.tag = function(a, tag) {
        if (a[tag] != null) {
            return a[tag];
        } else {
            return "";
        }
    };

    MapCSS.prop = function(obj, tag) {
        if (obj[tag] != null) {
            return obj[tag];
        } else {
            return "";
        }
    };

    MapCSS.sqrt = function(arg) {
        return Math.sqrt(arg);
    };

    MapCSS.boolean = function(arg) {
        if (arg == '0' || arg == 'false' || arg == '') {
            return 'false';
        } else {
            return 'true';
        }
    };

    MapCSS.boolean = function(exp, if_exp, else_exp) {
        if (MapCSS.boolean(exp) == 'true') {
            return if_exp;
        } else {
            return else_exp;
        }
    };

    MapCSS.metric = function(arg) {
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

    MapCSS.zmetric = function(arg) {
        return MapCSS.metric(arg);
    };
    
    MapCSS.loadStyle = function(style, restyle, images) {
        MapCSS.styles[style] = {
            restyle: restyle,
            images: images,
        };
        
        if (!MapCSS.currentStyle) {
            MapCSS.currentStyle = style;
        }
    }
    
    MapCSS.loadImages = function(style, url) {
        var img = new Image;
        img.onload = function() {
            var images = MapCSS.styles[style].images;
            for(image in images) {
                images[image].sprite = img;
            }
        };
        
        img.onerror = function() {
            alert("Couldn't load CSS sprite")
        };        

        img.src = url;
    }
    
    MapCSS.getImage = function(ref) {
        return MapCSS.styles[MapCSS.currentStyle].images[ref];
    }
    
    MapCSS.restyle = function() {
        return MapCSS.styles[MapCSS.currentStyle].restyle;
    }
    
    return MapCSS;
})();    
