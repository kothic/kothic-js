L.TileLayer.Kothic = L.TileLayer.extend({
    options: {
        tileSize: 256 * 4,
        zoomOffset: 2,
        minZoom: 2,
        maxZoom: 22,
        updateWhenIdle: true,
        unloadInvisibleTiles: true,
        attribution: 'Map data &copy; 2013 <a href="http://osm.org/copyright">OpenStreetMap</a> contributors,' +
                     ' Rendering by <a href="http://github.com/kothic/kothic-js">Kothic JS</a>',
        async: true,
        buffered: false,
    },

    initialize: function(url, options) {
        L.Util.setOptions(this, options);

        this._url = url;
        this._canvases = {};
        this._scripts = {};
        this._debugMessages = [];

        //var css = "way[!boundary] {width: 1;color: red;} way[boundary] {width: 1;color: blue;dashes: 5,5;}"

        var mapcss = new window.MapCSS(options.css, {
          cache: {},
        });

        this._kothic = new window.Kothic(mapcss, {
          //Synchronous mode for testing reasons
          getFrame: (callback) => callback(),
          browserOptimizations: false,
          debug: true
        });


        var proto = this._canvasProto = L.DomUtil.create('canvas', 'leaflet-tile');
    		proto.width = proto.height = this.options.tileSize;
    },

    createTile: function(tile, done) {
  		var canvas = this._canvasProto.cloneNode(false);
  		tile.onselectstart = tile.onmousemove = L.Util.falseFn;

      tile.z = tile.z - this.options.zoomOffset;
      var url = L.Util.template(this._url, L.Util.extend(tile, this.options));
      canvas.setAttribute('ref', url);

      var that = this;
      window.Kothic.loadJSON(url, function(geojson) {
        that._kothic.render(canvas, geojson, tile.z, done);
      });

  		return canvas;
  	},
});
