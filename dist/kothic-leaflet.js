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
        debugTiles: false,
        styles: MapCSS.availableStyles
    },

    initialize: function(url,options) {
        L.Util.setOptions(this, options);

        this._url = url;
        this._canvases = {};
        this._debugMessages = [];

        window.onKothicDataResponse = L.Util.bind(this._onKothicDataResponse, this);
        window.onKothicDataError = L.Util.bind(this._onKothicDataError, this);
    },

    _onKothicDataResponse: function(data, zoom, x, y, done) {
        var error;
        var key = [zoom, x, y].join('/'),
            canvas = this._canvases[key],
            zoomOffset = this.options.zoomOffset;

        if (!canvas) {
            return;
        }

        this._debugTile(canvas, {
            status: 'data loaded',
            zoom: zoom,
            x: x,
            y: y,
            features: data.features.length
        });

        function onRenderComplete() {
            this._debugTile(canvas, {
                status: 'rendered',
                zoom: zoom,
                x: x,
                y: y,
                features: data.features.length
            });
            done(error, canvas);
        }

        this._invertYAxe(data);

        var styles = this.options.styles;

        Kothic.render(canvas, data, zoom + zoomOffset, {
            styles: styles,
            locales: ['be', 'ru', 'en'],
            onRenderComplete: L.Util.bind(onRenderComplete, this)
        });

        delete this._canvases[key];
    },

    _onKothicDataError: function(url, zoom, x, y, status, done) {
        var key = [zoom, x, y].join('/'),
            canvas = this._canvases[key],
            error = new Error('Kothic tile data request failed: ' + status + ' ' + url);

        if (!canvas) {
            return;
        }

        this._debugTile(canvas, {
            status: 'data error ' + status,
            zoom: zoom,
            x: x,
            y: y,
            url: url
        });
        delete this._canvases[key];
        done(error, canvas);
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
        this._debugTile(canvas, {
            status: 'loading',
            zoom: rzoom,
            x: tilePoint.x,
            y: tilePoint.y,
            url: url
        });
        this._loadJSON(url, rzoom, tilePoint.x, tilePoint.y, done);
    },

    _debugTile: function(canvas, info) {
        if (!this.options.debugTiles) {
            return;
        }

        this._debugMessages.push(info);
        this._drawTileDebugOverlay(canvas, info);
    },

    _drawTileDebugOverlay: function(canvas, info) {
        var ctx = canvas.getContext && canvas.getContext('2d'),
            tileId = [info.zoom, info.x, info.y].join('/'),
            lines = [
                'Kothic ' + tileId,
                info.status
            ],
            i;

        if (!ctx) {
            return;
        }

        if (info.features !== undefined) {
            lines.push(info.features + ' features');
        }
        if (info.url) {
            lines.push(info.url);
        }

        ctx.save();
        ctx.globalAlpha = 0.78;
        ctx.fillStyle = '#222';
        ctx.fillRect(4, 4, canvas.width - 8, 18 + lines.length * 14);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = '12px sans-serif';
        ctx.textBaseline = 'top';
        for (i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], 10, 10 + i * 14);
        }
        ctx.restore();
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
                    window.onKothicDataError(url, zoom, x, y, xhr.status, done);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send(null);
    }
});
