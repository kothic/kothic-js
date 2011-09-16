/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Kothic.style = (function () {

    return {
        defaultCanvasStyles: {
            strokeStyle: "rgba(0,0,0,0.5)",
            fillStyle: "rgba(0,0,0,0.5)",
            lineWidth: 1,
            lineCap: "round",
            lineJoin: "round",
            textAlign: 'center',
            textBaseline: 'middle'
        },

        populateLayers: function (features, zoom, styles) {
            var layers = {}, i, len;
        
            var styledFeatures = Kothic.style.styleFeatures(features, zoom, styles);

            for (i = 0, len = styledFeatures.length; i < len; i++) {
                var feature = styledFeatures[i],
                        layerId = parseFloat(feature.properties.layer) || 0,
                        layerStyle = feature.style["-x-mapnik-layer"];

                if (layerStyle === "top") {
                    layerId = 10000;
                }
                if (layerStyle === "bottom") {
                    layerId = -10000;
                }
                if (!layers.hasOwnProperty(layerId)) {
                    layers[layerId] = [];
                }
                layers[layerId].push(feature);
            }

            return layers;
        },
    
        getStyle: function (feature, zoom, styleNames) {
            var type, selector;
            if (feature.type === 'Polygon' || feature.type === 'MultiPolygon') {
                type = 'way';
                selector = 'area';
            } else if (feature.type === 'LineString' || feature.type === 'MultiLineString') {
                type = 'way';
                selector = 'line';
            } else if (feature.type === 'Point' || feature.type === 'MultiPoint') {
                type = 'node';
                selector = 'node';
            }
            
            return MapCSS.restyle(styleNames, feature.properties, zoom, type, selector);
        },

        styleFeatures: function (features, zoom, styleNames) {
            var styledFeatures = [],
                    i, j, len, feature, style, restyledFeature;

            for (i = 0, len = features.length; i < len; i++) {
                feature = features[i];
                style = this.getStyle(feature, zoom, styleNames);

                for (j in style) {
                    if (style.hasOwnProperty(j)) {
                        restyledFeature = Kothic.utils.extend({}, feature);
                        restyledFeature.kothicId = i + 1;
                        restyledFeature.style = style[j];
                        styledFeatures.push(restyledFeature);
                    }
                }
            }

            styledFeatures.sort(
                function (a, b) {
                    return parseFloat(a.style["z-index"]) - parseFloat(b.style["z-index"] || 0);
                }
            );

            return styledFeatures;
        },

        getFontString: function (name, size) {
            name = name || '';
            size = size || 9;

            var family = name ? name + ', ' : '';

            name = name.toLowerCase();

            var styles = [];
            if (name.indexOf("italic") !== -1 || name.indexOf("oblique") !== -1) {
                styles.push('italic');
            }
            if (name.indexOf("bold") !== -1) {
                styles.push('bold');
                //family += '"'+name.replace("bold", "")+'", ';
                family += name.replace("bold", "") + ', ';
            }

            styles.push(size + 'px');

            if (name.indexOf('serif') !== -1) {
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
}());
