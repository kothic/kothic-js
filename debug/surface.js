
(function(MapCSS) {
    function restyle(style, tags, zoom, type, selector) {
        var s_default = {};
        var s_overlay = {};

        if (((type == 'way' && tags['highway'] == 'primary' && (!('surface' in tags))))) {
            s_overlay['color'] = '#f00';
            s_overlay['width'] = 1;
            s_overlay['z-index'] = 100;
        }

        if (Object.keys(s_default).length > 0) {
            style['default'] = s_default;
        }
        if (Object.keys(s_overlay).length > 0) {
            style['overlay'] = s_overlay;
        }
        return style;
    }
    
    var sprite_images = {};

    var external_images = [];

    MapCSS.loadStyle('surface', restyle, sprite_images, external_images);
    MapCSS.preloadExternalImages('surface');
})(MapCSS);
    