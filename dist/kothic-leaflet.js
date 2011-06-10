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
		buffered: true
	},
	
	initialize: function(options) {
		L.Util.setOptions(this, options);
		
		this._canvases = {};
		this._debugMessages = [];
		
		var layer = this;
		
		window.onKothicDataResponse = L.Util.bind(this._onKothicDataResponse, this);
	},
	
	_onKothicDataResponse: function(data, zoom, x, y) {
		var key = [zoom, x, y].join('/'),
			canvas = this._canvases[key],
			buffered = this.options.buffered,
			zoomOffset = this.options.zoomOffset,
			layer = this;
		
		function onRenderComplete(debugInfo) {
			// TODO move this logic outside
			var debugStr = layer.getDebugStr(debugInfo, x, y, zoom);
			layer._debugMessages.push(debugStr);
			layer.tileDrawn(canvas);
		}
		
		Kothic.render(canvas, data, zoom + zoomOffset, layer._additionalStyle, onRenderComplete, buffered);
		delete this._canvases[key];
	},
	
	getDebugStr: function(debugInfo, x, y, zoom) {
		return '<b>tile ' + x + ':' + y + ':' + zoom + '</b><br />' +
			'<table><tr><td>' + debugInfo.layersStyled + '</td><td>layers styled</td></tr>' +
			'<tr><td>' + debugInfo.mapRendered + '</td><td>map rendered</td></tr>' +
			'<tr><td>' + debugInfo.iconsAndTextRendered + '</td><td>icons/text rendered</td></tr>' +
			'<tr><td>' + debugInfo.total + '</td><td>total</td></tr></table>';
	},
	
	getDebugMessages: function() {
		return this._debugMessages;
	},
	
	drawTile: function(canvas, tilePoint, zoom) {
		var zoomOffset = this.options.zoomOffset,
			key = [(zoom - zoomOffset), tilePoint.x, tilePoint.y].join('/');
		
		this._canvases[key] = canvas;
		this._loadScript('http://osmosnimki.ru/vtile/' + key + '.js');
	},
	
	setAdditionalStyle: function(fn) {
		this._additionalStyle = fn;
		
		// TODO implement layer.redraw() in Leaflet
		if (this._map && this._map._container) {
			this._reset();
			this._update();
		}
	},
	
	_loadScript: function(url) {
		var script = document.createElement('script');
		script.src = url;
		script.charset = 'utf-8';
		document.getElementsByTagName('head')[0].appendChild(script);
	}
});