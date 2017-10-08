L.TileLayer.Kothic = L.GridLayer.extend({
    options: {
        tileSize: 256,
        zoomOffset: 0,
        minZoom: 2,
        maxZoom: 22,
        updateWhenIdle: true,
        unloadInvisibleTiles: true,
        attribution: 'Map data &copy; 2019 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors,' +
                     ' Rendering by <a href="http://github.com/kothic/kothic-js">Kothic JS</a>',
        async: true,
        buffered: false,
        styles: MapCSS.availableStyles
    },

    initialize: function(url,options) {
        L.Util.setOptions(this, options);

        this._url = url;
        this._canvases = {};
        this._debugMessages = [];

        window.onKothicDataResponse = L.Util.bind(this._onKothicDataResponse, this);
    },

    _onKothicDataResponse: function(data, zoom, x, y, done) {
        var error;
        var key = [zoom, x, y].join('/'),
            canvas = this._canvases[key],
            zoomOffset = this.options.zoomOffset;

        if (!canvas) {
            return;
        }

        function onRenderComplete() {
            done(error, canvas);
        }

        this._invertYAxe(data);

        var styles = this.options.styles;

        Kothic.render(canvas, data, zoom + zoomOffset, {
            styles: styles,
            locales: ['be', 'ru', 'en'],
            onRenderComplete: onRenderComplete
        });

        delete this._canvases[key];
    },

    getDebugMessages: function() {
        return this._debugMessages;
    },

    createTile: function(tilePoint, done) {
        // create a <canvas> element for drawing
        var tile = L.DomUtil.create('canvas', 'leaflet-tile');
        // setup tile width and height according to the options
        var size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;

        tile._layer  = this;
        tile.onerror = this._tileOnError;

        var tileUrl = this._getTileUrl(tilePoint);
        this.fire('tileloadstart', {
            tile: tile,
            url: tileUrl
        });

        // Fall back to standard behaviour
        tile.onload = this._tileOnLoad;
        tile.src = tileUrl;
        this.drawTile(tile, tilePoint, tilePoint.z, done);

        return tile;
    },

    _getTileUrl: function(tilePoint) {
        return this._url.replace('{x}',tilePoint.x).
        replace('{y}',tilePoint.y).
        replace('{z}',tilePoint.z);
    },

    drawTile: function(canvas, tilePoint, zoom, done) {
        var zoomOffset = this.options.zoomOffset,
            rzoom = zoom - zoomOffset,
            key = [rzoom, tilePoint.x, tilePoint.y].join('/'),
            url=this._url.replace('{x}',tilePoint.x).
                    replace('{y}',tilePoint.y).
                    replace('{z}',rzoom);
        this._canvases[key] = canvas;
        this._loadJSON(url, rzoom, tilePoint.x, tilePoint.y, done);
    },

    enableStyle: function(name) {
        if (MapCSS.availableStyles.indexOf(name) >= 0 && this.options.styles.indexOf(name) < 0) {
            this.options.styles.push(name);
            this.redraw();
        }
    },

    disableStyle: function(name) {
        if (this.options.styles.indexOf(name) >= 0) {
            var i = this.options.styles.indexOf(name);
            this.options.styles.splice(i, 1);
            this.redraw();
        }
    },

    redraw: function() {
        // TODO implement layer.redraw() in Leaflet
        if (this._map && this._map._container) {
            MapCSS.invalidateCache();
            this._invalidateAll();
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

    _loadJSON: function(url, zoom, x, y, done) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    window.onKothicDataResponse(JSON.parse(xhr.responseText), zoom, x, y, done);
                } else {
                    console.debug("failed:", url, xhr.status);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    }
});
