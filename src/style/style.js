
Kothic.style = {

    defaultCanvasStyles: {
        strokeStyle: 'rgba(0,0,0,0.5)',
        fillStyle: 'rgba(0,0,0,0.5)',
        lineWidth: 1,
        lineCap: 'round',
        lineJoin: 'round',
        textAlign: 'center',
        textBaseline: 'middle'
    },

    populateLayers: function (features, zoom, styles) {
        var layers = {},
            i, len, feature, layerId, layerStyle;

        var styledFeatures = Kothic.style.styleFeatures(features, zoom, styles);

        for (i = 0, len = styledFeatures.length; i < len; i++) {
            feature = styledFeatures[i];
            layerStyle = feature.style['-x-mapnik-layer'];
            layerId = !layerStyle ? feature.properties.layer || 0 :
                layerStyle === 'top' ? 10000 : -10000;

            layers[layerId] = layers[layerId] || [];
            layers[layerId].push(feature);
        }

        return layers;
    },

    getStyle: function (feature, zoom, styleNames) {
        var shape = feature.type,
            type, selector;
        if (shape === 'LineString' || shape === 'MultiLineString') {
            type = 'way';
            selector = 'line';
        } else if (shape === 'Polygon' || shape === 'MultiPolygon') {
            type = 'way';
            selector = 'area';
        } else if (shape === 'Point' || shape === 'MultiPoint') {
            type = 'node';
            selector = 'node';
        }

        return MapCSS.restyle(styleNames, feature.properties, zoom, type, selector);
    },

    styleFeatures: function (features, zoom, styleNames) {
        var styledFeatures = [],
            i, j, len, feature, style, restyledFeature, k;

        for (i = 0, len = features.length; i < len; i++) {
            feature = features[i];
            style = this.getStyle(feature, zoom, styleNames);

            for (j in style) {
                if (j === 'default') {
                    restyledFeature = feature;
                } else {
                    restyledFeature = {};
                    for (k in feature) {
                        restyledFeature[k] = feature[k];
                    }
                }

                restyledFeature.kothicId = i + 1;
                restyledFeature.style = style[j];
                restyledFeature.zIndex = style[j]['z-index'] || 0;
                restyledFeature.sortKey = (style[j]['fill-color'] || '') + (style[j].color || '');
                styledFeatures.push(restyledFeature);
            }
        }

        styledFeatures.sort(function (a, b) {
            return a.zIndex !== b.zIndex ? a.zIndex - b.zIndex :
                   a.sortKey < b.sortKey ? -1 :
                   a.sortKey > b.sortKey ? 1 : 0;
        });

        return styledFeatures;
    },

    getFontString: function (name, size, st) {
        name = name || '';
        size = size || 9;

        var family = name ? name + ', ' : '';

        name = name.toLowerCase();

        var styles = [];
        if (st['font-style'] === 'italic' || st['font-style'] === 'oblique') {
            styles.push(st['font-style']);
        }
        if (st['font-variant'] === 'small-caps') {
            styles.push(st['font-variant']);
        }
        if (st['font-weight'] === 'bold') {
            styles.push(st['font-weight']);
        }

        styles.push(size + 'px');

        if (name.indexOf('serif') !== -1 && name.indexOf('sans-serif') === -1) {
            family += 'Georgia, serif';
        } else {
            family += '"Helvetica Neue", Arial, Helvetica, sans-serif';
        }
        styles.push(family);

        return styles.join(' ');
    },

    setStyles: function (ctx, styles) {
        var i;
        for (i in styles) {
            if (styles.hasOwnProperty(i)) {
                ctx[i] = styles[i];
            }
        }
    }
};
