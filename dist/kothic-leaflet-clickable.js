L.TileLayer.Kothic.Clickable = L.TileLayer.Kothic.extend({
    options: {
        pixelThreshold: 10
    },

    initialize: function(url, options) {
        this._data = {};
        L.TileLayer.Kothic.prototype.initialize.call(this, url, options);
    },

    onAdd: function(map) {
        this._clickHandler = L.Util.bind(this._onclick, this);
        this._tileUnloadHandler = L.Util.bind(this._onTileUnload, this);
        map.on('click', this._clickHandler);
        this.on('tileunload', this._tileUnloadHandler);
        L.GridLayer.prototype.onAdd.call(this, map);
    },

    onRemove: function(map) {
        if (this._clickHandler) {
            map.off('click', this._clickHandler);
            delete this._clickHandler;
        }
        if (this._tileUnloadHandler) {
            this.off('tileunload', this._tileUnloadHandler);
            delete this._tileUnloadHandler;
        }
        this._data = {};
        L.GridLayer.prototype.onRemove.call(this, map);
    },

    _onclick: function(e) {
        var tileClickPos = this._map.project(e.latlng),
            tileSize = this.options.tileSize,
            tileX = Math.floor(tileClickPos.x / tileSize),
            tileY = Math.floor(tileClickPos.y / tileSize),
            key = [this._map.getZoom() - this.options.zoomOffset, tileX, tileY].join('/'),
            data = this._data[key],
            pixelsToKothicUnits,
            dataX,
            dataY,
            threshold,
            lowest = Number.MAX_VALUE,
            nearestFeature = null,
            i,
            dx,
            dy,
            dist,
            featLatLng;

        if (!data || !data.features.length) {
            return;
        }

        pixelsToKothicUnits = data.granularity / tileSize;
        tileClickPos.x %= tileSize;
        tileClickPos.y %= tileSize;
        dataX = tileClickPos.x * pixelsToKothicUnits;
        dataY = tileClickPos.y * pixelsToKothicUnits;
        threshold = this.options.pixelThreshold * pixelsToKothicUnits;

        for (i = 0; i < data.features.length; i++) {
            dx = Math.abs(data.features[i].coordinates[0] - dataX);
            dy = Math.abs(data.features[i].coordinates[1] - dataY);
            if (dx < threshold && dy < threshold) {
                dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < lowest) {
                    lowest = dist;
                    nearestFeature = data.features[i];
                }
            }
        }

        if (nearestFeature !== null) {
            featLatLng = this._map.unproject(new L.Point(
                tileX * tileSize + nearestFeature.coordinates[0] / pixelsToKothicUnits,
                tileY * tileSize + nearestFeature.coordinates[1] / pixelsToKothicUnits
            ));

            this.fire('featureclick', {
                latlng: featLatLng,
                feature: nearestFeature
            });
        }
    },

    _onTileUnload: function(e) {
        var coords = e.coords,
            key = [coords.z - this.options.zoomOffset, coords.x, coords.y].join('/');

        delete this._data[key];
    },

    _onKothicDataResponse: function(data, zoom, x, y, done) {
        var key = [zoom, x, y].join('/'),
            stored = {
                granularity: data.granularity,
                features: []
            },
            i;

        if (!this._canvases[key]) {
            L.TileLayer.Kothic.prototype._onKothicDataResponse.call(this, data, zoom, x, y, done);
            return;
        }

        L.TileLayer.Kothic.prototype._onKothicDataResponse.call(this, data, zoom, x, y, done);

        if (!this._data[key]) {
            for (i = 0; i < data.features.length; i++) {
                if (data.features[i].type === 'Point') {
                    stored.features.push(data.features[i]);
                }
            }
            this._data[key] = stored;
        }
    }
});
