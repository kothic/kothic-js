
(function (MapCSS) {
    'use strict';

    function restyle(style, tags, zoom, type, selector) {
        var s_default = {}, s_overlay = {};

        if (((type == 'way' && tags['highway'] == 'primary' && (!tags.hasOwnProperty('surface'))))) {
            s_overlay['color'] = '#f00';
            s_overlay['width'] = 1;
            s_overlay['z-index'] = 100;
        }

        if (Object.keys(s_default).length) {
            style['default'] = s_default;
        }
        if (Object.keys(s_overlay).length) {
            style['overlay'] = s_overlay;
        }
        return style;
    }

    var sprite_images = {
    }, external_images = [], presence_tags = ['surface'], value_tags = ['highway'];

    MapCSS.loadStyle('surface', restyle, sprite_images, external_images, presence_tags, value_tags);
    MapCSS.preloadExternalImages('surface');
})(MapCSS);

