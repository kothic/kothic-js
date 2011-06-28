
(function(MapCSS) {
    function restyle(style, tags, zoom, type, selector) {
        var s_default = {};

        if (((type == 'way' && tags['highway'] == 'primary' && (!('surface' in tags))))) {
            s_default['color'] = '#f00';
            s_default['width'] = 1;
            s_default['z-index'] = 100;
        }

        if (((type == 'way' && tags['highway'] && (('ref' in tags))))) {
						//s_default['shield-casing-color'] = '#000';
						//s_default['shield-casing-width'] = '1';
						s_default['shield-frame-color'] = '#fff';
						s_default['shield-frame-width'] = '1';
						s_default['shield-color'] = '#05AD3D';
            s_default['z-index'] = 100;
						s_default['shield-text'] = tags["ref"];
						s_default['shield-text-color'] = "#fff";
						s_default['shield-font-family'] = "DejaVu Sans";
						s_default['shield-font-size'] = 8;
        }

        if (s_default) {
            style['default_surface'] = s_default;
        }
        return style;
    }

    var sprite_images = {};

    var external_images = [];

    MapCSS.loadStyle('surface', restyle, sprite_images, external_images);
    MapCSS.preloadExternalImages('surface');
})(MapCSS);
