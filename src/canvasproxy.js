/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

CanvasProxy = function(ctx) {
	var _ctx = ctx;
	var stubGeometry = false;
	var stubContext = false;
	var stubText = false;
	var _curProps = {
		strokeStyle: "rgba(0,0,0,0.5)",
		fillStyle: "rgba(0,0,0,0.5)",
		lineWidth: 1,
		globalAlpha: 1,
		lineCap: "round",
		lineJoin: "round",
		textAlign: 'center',
		textBaseline: 'middle'
	};

	_textMeasureCache = {};
	for (var i in this._curProps) {
		if (_curProps.hasOwnProperty(i)) {
			this[i] = _curProps[i];
			_ctx[i] = _curProps[i];
		}
	}
	this.antialiasing = "default";

	this._checkStroke = function() {
		var z = ["globalAlpha", "strokeStyle", "lineWidth", "lineCap", "lineJoin"]
		for (var i in z) {
			i = z[i];
			if (this[i] != _curProps[i] && this[i]) {
				_ctx[i] = this[i];
				_curProps[i] = this[i];
			}
		}
	}
	this._checkFill = function() {
		var z = ["globalAlpha", "fillStyle"]
		for (var i in z) {
			i = z[i];
			if (this[i] != _curProps[i] && this[i]) {
				_ctx[i] = this[i];
				_curProps[i] = this[i];
			}
		}
	}
	this._checkText = function() {
		var z = ["font", "textAlign", "textBaseline"]
		for (var i in z) {
			i = z[i];
			if (this[i] != _curProps[i] && this[i]) {
				_ctx[i] = this[i];
				_curProps[i] = this[i];
			}
		}
	}
	this._resetAfterRestore = function() {
		var z = ["fillStyle", "strokeStyle", "lineCap", "textAlign", "textBaseline","globalAlpha"]
		for (var i in z) {
			i = z[i];
			if (this[i]) {
				_ctx[i] = this[i];
			}
		}
	}


	this.fillRect = function(x, y, z, t) {
		this._checkFill();
		_ctx.fillRect(x, y, z, t)
	}
	this.drawImage = function(x, y, z) {
		_ctx.drawImage(x, y, z)
	}
	this.lineTo = function(x, y) {
		_ctx.lineTo(x, y)
	}
	this.moveTo = function(x, y) {
		_ctx.moveTo(x, y)
	}
	this.translate = function(x, y) {
		_ctx.translate(x, y)
	}
	this.createPattern = function(x, y) {
		_ctx.createPattern(x, y)
	}
	this.rotate = function(x) {
		_ctx.rotate(x)
	}
	this.save = function() {
		_ctx.save()
	}
	this.restore = function() {
		_ctx.restore();
		this._resetAfterRestore();
	}
	this.beginPath = function() {
		_ctx.beginPath()
	}
	this.stroke = function() {
		this._checkStroke();
		_ctx.stroke()
	}
	this.fill = function() {
		this._checkFill();
		_ctx.fill()
	}
	this.fillText = function(x, y, z) {
		this._checkFill();
		this._checkText();
		_ctx.fillText(x, y, z)
	}
	this.strokeText = function(x, y, z) {
		this._checkStroke();
		this._checkText();
		_ctx.strokeText(x, y, z)
	}
	this.measureText = function(x) {
		this._checkText();
		var font = this["font"];
		if (!_textMeasureCache[font]) {
			_textMeasureCache[font] = {}
		}

		if (!_textMeasureCache[font][x]) {
			_textMeasureCache[font][x] = _ctx.measureText(x);
		}

		return _textMeasureCache[font][x];
	}
	if (stubGeometry) {
		var z = ["fill","stroke","createPattern","moveTo","lineTo","drawImage","fillRect"]
		for (var i in z) {
			i = z[i];
			this[i] = function(a, b, c, d, e, f, g) {
			}
		}
	}
	if (stubContext) {
		var z = ["save","restore","translate","beginPath"]
		for (var i in z) {
			i = z[i];
			this[i] = function(a, b, c, d, e, f, g) {
			}
		}
	}
	if (stubText) {
		var z = ["fillText","measureText","strokeText"]
		for (var i in z) {
			i = z[i];
			this[i] = function(a, b, c, d, e, f, g) {
				return 4
			}
		}
	}
}
