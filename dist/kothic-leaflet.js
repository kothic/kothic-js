L.TileLayer.Kothic = L.TileLayer.Canvas.extend({
    options: {
        tileSize: 256 * 4,
        zoomOffset: 2,
        minZoom: 2,
        maxZoom: 22,
        updateWhenIdle: true,
        unloadInvisibleTiles: true,
        attribution: 'Map data &copy; 2011 OpenStreetMap contributors, Rendering by <a href="http://github.com/kothic/kothic-js">Kothic JS</a>',
        async: true,
        buffered: false,
        styles: MapCSS.availableStyles
    },

    initialize: function(url,options) {
        L.Util.setOptions(this, options);

        this._url = url;
        this._canvases = {};
        this._scripts = {};
        this._debugMessages = [];

        window.onKothicDataResponse = L.Util.bind(this._onKothicDataResponse, this);

        this.kothic = new Kothic({
            buffered: this.options.buffered,
            styles: this.options.styles,
            locales: ['be', 'ru', 'en']
        });
    },

    _onKothicDataResponse: function(data, zoom, x, y) {
        var key = [zoom, x, y].join('/'),
            canvas = this._canvases[key],
            zoomOffset = this.options.zoomOffset,
            layer = this;

        if (!canvas) {
            return;
        }

        function onRenderComplete(debugInfo) {
            debugInfo.x = x;
            debugInfo.y = y;
            debugInfo.zoom = zoom;
            layer._debugMessages.push(debugInfo);

            document.getElementsByTagName('head')[0].removeChild(layer._scripts[key]);
            delete layer._scripts[key];

            layer.tileDrawn(canvas);
        }

        this._invertYAxe(data);

        this.kothic.render(canvas, data, zoom + zoomOffset, onRenderComplete);
        delete this._canvases[key];
    },

    getDebugMessages: function() {
        return this._debugMessages;
    },

    drawTile: function(canvas, tilePoint, zoom) {
        var zoomOffset = this.options.zoomOffset,
            key = [(zoom - zoomOffset), tilePoint.x, tilePoint.y].join('/'),
            url=this._url.replace('{x}',tilePoint.x).
                    replace('{y}',tilePoint.y).
                    replace('{z}',zoom-zoomOffset);
        this._canvases[key] = canvas;
        this._scripts[key] = this._loadScript(url);
    },
    
    enableStyle: function(name) {
        if (MapCSS.availableStyles.indexOf(name) >= 0 && this.options.styles.indexOf(name) < 0) {
            this.options.styles.push(name);
            this.redraw();
        }
    },

    disableStyle: function(name) {
        if (this.options.styles.indexOf(name) >= 0) {
            Kothic.utils.remove_from_array(this.options.styles, name);
            this.redraw();
        }
    },

    redraw: function() {
        MapCSS.invalidateCache();
        // TODO implement layer.redraw() in Leaflet
        this._map.getPanes().tilePane.empty = false;
        if (this._map && this._map._container) {
            this._reset();
            this._update();
        }
    },
    
    _invertYAxe: function(data) {
        var type, coordinates, tileSize = data.granularity, i, j, k, l, feature;
        for (i = 0; i < data.features.length; i++) {
            feature = data.features[i];
            coordinates = feature.coordinates;
            type = data.features[i].type;
            if (type === 'Point') {
                coordinates[1] = tileSize - coordinates[1];
            } else if (type === 'MultiPoint' || type === 'LineString') {
                for (j = 0; j < coordinates.length; j++) {
                    coordinates[j][1] = tileSize - coordinates[j][1];
                }
            } else if (type === 'MultiLineString' || type === 'Polygon') {
                for (k = 0; k < coordinates.length; k++) {
                    for (j = 0; j < coordinates[k].length; j++) {
                        coordinates[k][j][1] = tileSize - coordinates[k][j][1];
                    }
                }
            } else if (type === 'MultiPolygon') {
                for (l = 0; l < coordinates.length; l++) {
                    for (k = 0; k < coordinates[l].length; k++) {
                        for (j = 0; j < coordinates[l][k].length; j++) {
                            coordinates[l][k][j][1] = tileSize - coordinates[l][k][j][1];
                        }
                    }
                }
            } else {
                throw "Unexpected GeoJSON type: " + type;
            }
            
            if (feature.hasOwnProperty('reprpoint')) {
                feature.reprpoint[1] = tileSize - feature.reprpoint[1];
            }
        }
    },

    _loadScript: function(url) {
        var script = document.createElement('script');
        script.src = url;
        script.charset = 'utf-8';
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    }
});
