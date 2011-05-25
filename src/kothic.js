var Kothic = (function () {

	var canvas, ctx, 
		width, height,
		granularity,
		ws, hs,
		layers = {}, 
		layerIds = [],
		collides,
		dashPattern;
		
	
	var defaultStyles = {
		strokeStyle: "rgba(0,0,0,0.5)",
		fillStyle: "rgba(0,0,0,0.5)",
		lineWidth: 1,
		lineCap: "round",
		lineJoin: "round"
	};
	
	function render(canvasId, data, zoom, imageQ) {
		var start = +new Date(),
			layersStyled,
			mapRendered,
			iconsLoaded,
			finish;
		
		// init all variables
		
		canvas = (typeof canvasId == 'string' ? document.getElementById(canvasId) : canvasId);
		ctx = canvas.getContext('2d');
		
		width = canvas.width;
		height = canvas.height;
		
		granularity = data.granularity;
		ws = width / granularity;
		hs = height / granularity;
		
		collides = new CollisionBuffer();
		
		
		// style and populate layer structures

		populateLayers(data, zoom);
		
		layersStyled = +new Date();
		
		
		// render
		
		setStyles(defaultStyles);
		
		renderBackground(zoom);
		renderMap();
		
		mapRendered = +new Date();
		
		function onImagesLoad() {
			iconsLoaded = +new Date();
			renderIconsAndText();
			finish = +new Date();
			
			alert(
					(layersStyled - start) + ': layers styled\n' +
					(mapRendered - start) + ': map rendered\n' + 
					(iconsLoaded - start) + ': icons loaded\n' + 
					(finish - start) + ': icons and text rendered'
			);
		}
		
		if (Kothic.iconsLoaded) {
			onImagesLoad();
		} else {
			Kothic.onIconsLoad = onImagesLoad;
		}
	}
	
	function renderMap() {
		var layersLen = layerIds.length, 
			i, j, features, featuresLen;
	
		for (i = 0; i < layersLen; i++) {
			
			features = layers[layerIds[i]];
			featuresLen = features.length;
			
			if (!featuresLen) continue;
			
			for (j = 0; j < featuresLen; j++) {
				renderPolygonFill(features[j]);
			}
			ctx.lineCap = "butt";
			for (j = 0; j < featuresLen; j++) {
				renderCasing(features[j]);
			}
			ctx.lineCap = "round";
			for (j = 0; j < featuresLen; j++) {
				renderPolyline(features[j]);
			}
		}
	}
	
	function renderIconsAndText() {
		var layersLen = layerIds.length, 
			i, j, features, featuresLen;
		
		for (i = layersLen - 1; i >= 0; i--) {
			
			features = layers[layerIds[i]];
			featuresLen = features.length;
			
			if (!featuresLen) continue;
			
			for (j = featuresLen - 1; j >= 0; j--) {
				renderIcon(features[j]);
			}
			for (j = featuresLen - 1; j >= 0; j--) {
				renderText(features[j]);
			}
		}
	}
	
	function renderPolygonFill(feature) {
		var style = feature.style;
		if (!('fill-color' in style)) return;
		
		ctx.save();
		
		setStyles({
			fillStyle: style["fill-color"],
			globalAlpha: style["fill-opacity"] || style["opacity"]
		});
		pathGeoJSON(feature, "aaa", true);
		ctx.fill();
		
		ctx.restore();
	}
	
	function renderCasing(feature) {
		var style = feature.style;
		if (!("casing-width" in style)) return;
		
		ctx.save();
		
		var width = 2 * style["casing-width"] + ("width" in style ? style["width"] : 0);
		
		var dashes = "aaa";
		if ("dashes" in style) { dashes = style["dashes"].split(","); }
		if ("casing-dashes" in style) { dashes = style["casing-dashes"].split(","); }
		
		setStyles({
			lineWidth: width,
			strokeStyle: style["casing-color"] || style["color"],
			lineCap: style["casing-linecap"] || style["linecap"],
			lineJoin: style["casing-linejoin"] || style["linejoin"],
			globalAlpha: style["casing-opacity"] || style["opacity"]
		});
		
		pathGeoJSON(feature, dashes);
		ctx.stroke();
		
		ctx.restore();
	}
	
	function renderPolyline(feature) {
		var style = feature.style;
		if (!("width" in style)) return;
		
		ctx.save();
		
		var dashes = "aaa";
		if ("dashes" in style){dashes = style["dashes"].split(",");}
		
		setStyles({
			lineWidth: style.width,
			strokeStyle: style.color,
			lineCap: style.linecap,
			lineJoin: style.linejoin,
			globalAlpha: style.opacity
		});
		
		pathGeoJSON(feature, dashes);
		ctx.stroke();
		
		ctx.restore();
	}
	
	function renderBackground(zoom) {
		var style = restyle({}, zoom, "canvas")['default'],
			style2 = restyle({natural: "coastline"}, zoom, "Polygon")['default'];
		
		setStyles({
			fillStyle: style2["fill-color"] || style["fill-color"],
			globalAlpha: style2["fill-opacity"] || style2.opacity || style["fill-opacity"] || style.opacity
		});
		
		ctx.fillRect(-1, -1, this._width + 1, this._height + 1);
	}
	
	function renderIcon(feature) {
		var style = feature.style;
		if (!("icon-image" in style)) return;
		
		ctx.save();
		
		var img = Kothic.icons[style["icon-image"]],
			offset = 0,
			opacity = 1,
			mindistance = 0,
			textwidth = 0;
			
		setStyles({
			fillStyle: style["text-color"],
			lineWidth: style["text-halo-radius"] + 2,
			strokeStyle: style["text-halo-color"]
		});
		if ("text-offset" in style){offset = style["text-offset"];}
		if ("opacity" in style){opacity = style.opacity;}
		if ("text-opacity" in style){opacity = style["text-opacity"];}
		if ("-x-mapnik-min-distance" in style){mindistance = style["-x-mapnik-min-distance"];}
		
		var point;
		if (feature.type == "Point") { 
			point = [ws * feature.coordinates[0], hs * (granularity - feature.coordinates[1])];
		}
		if (feature.type == "Polygon") { 
			point = [ws * feature.reprpoint[0], hs * (granularity - feature.reprpoint[1])];
		}
		if (style["text"]){ctx.font = fontString(style["font-family"],style["font-size"]);}
		if (collides.checkPointWH(point, img.width, img.height)) return;
		if (style["text"]){
			textwidth = ctx.measureText(style["text"]).width;
			if (style["text-allow-overlap"]!="true" && collides.checkPointWH([point[0],point[1]+offset], textwidth, 10)) return;
		}
		if (opacity <1){
			ctx.fillStyle = new RGBColor(ctx.fillStyle, opacity).toRGBA();
			ctx.strokeStyle = new RGBColor(ctx.strokeStyle, opacity).toRGBA();
		}
		
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		if(style["text"]){
			if ("text-halo-radius" in style)
				ctx.strokeText(style["text"], point[0],point[1]+offset);
			ctx.fillText(style["text"], point[0],point[1]+offset);
		}
		
		ctx.drawImage(img, point[0]-img.width/2,point[1]-img.height/2);
		
		collides.addPointWH(point, img.width, img.height, mindistance); //TOFIX: img won't have width and height until load 
		collides.addPointWH([point[0], point[1] + offset], textwidth, 10, mindistance);
		
		ctx.restore();
	}
	
	function renderText(feature) {
		var style = feature.style;
		if (!style['text'] || ("icon-image" in style)) return; 

		ctx.save();

		setStyles({
			fillStyle: style["text-color"],
			lineWidth: style["text-halo-radius"] + 2,
			strokeStyle: style["text-halo-color"],
			font: fontString(style["font-family"], style["font-size"])
		});
		
		var offset = style["text-offset"] || 0,
			opacity = style["text-opacity"] || style["opacity"] || 1,
			mindistance = style["-x-mapnik-min-distance"] || 0,
			textwidth = ctx.measureText(style["text"]).width;
	
		var coords;
		
		switch (feature.type) {
			case 'Point': coords = feature.coordinates; break;
			case 'Polygon': coords = feature.reprpoint; break;
			case 'LineString': coords = feature.coordinates[0]; break;
		}
		var x = ws * coords[0],
			y = hs * (granularity - coords[1]) + offset,
			point = [x, y];
		
		if ((style["text-allow-overlap"]!="true") && collides.checkPointWH(point, textwidth, 5)) return;
		
		if (opacity < 1){
			ctx.fillStyle = new RGBColor(ctx.fillStyle, opacity).toRGBA();
			ctx.strokeStyle = new RGBColor(ctx.strokeStyle, opacity).toRGBA();
		}
		
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		
		if (feature.type=="Polygon" || feature.type == "Point") {
			if ("text-halo-radius" in style) ctx.strokeText(style["text"], x, y);
			ctx.fillText(style["text"], x, y);
			collides.addPointWH(point, textwidth, 10, mindistance);
		} else { // LineString
			textOnGeoJSON(feature, ("text-halo-radius" in style), style["text"]);
		}
		
		ctx.restore();		
	}
	
	function styleFeatures(features, zoom) {
		var styledFeatures = [],
			i, j, len, feature, style, restyledFeature;
		
		for (i = 0, len = features.length; i < len; i++) {
			feature = features[i];
	
			style = restyle(feature.properties, zoom, feature.type);
			
			for (j in style) {
				if (style.hasOwnProperty(j)) {
					restyledFeature = extend({}, feature);
					restyledFeature.style = style[j];
					restyledFeature.style["z-index"] = restyledFeature.style["z-index"] || 0;
					styledFeatures.push(restyledFeature);
				}
			}
		}
		
		styledFeatures.sort(function (a, b) {
			return a.style["z-index"] - b.style["z-index"];
		});
		
		return styledFeatures;
	}
	
	function populateLayers(data, zoom) {
		var styledFeatures = styleFeatures(data.features, zoom);
		
		for (var i = 0, len = styledFeatures.length; i < len; i++) {
			var feature = styledFeatures[i],
				layerId = parseFloat(feature.properties.layer) || 0,
				layerStyle = feature.style["-x-mapnik-layer"];
				
			if (layerStyle == "top" ) { 
				layerId = 10000;
			}
			if (layerStyle == "bottom" ) {
				layerId = -10000;
			}
			if (!(layerId in layers)) {
				layers[layerId] = [];
				layerIds.push(layerId);
			}
			layers[layerId].push(feature);
		};
		
		layerIds.sort();
	}
	
	function setStyles(styles) {
		for (var i in styles) {
			if (styles.hasOwnProperty(i) && styles[i]) {
				ctx[i] = styles[i];
			}
		}
	}
	
	function pathGeoJSON(val, dashes, fill) {
		ctx.beginPath();

		if (val.type == "Polygon") {
			var firstpoint = val.coordinates[0][0];
			for (coordseq in val.coordinates) {
				coordseq = val.coordinates[coordseq];
				moveTo(coordseq[0]);
				var prevcoord = coordseq[0];
				if (fill) {
					for (coord in coordseq) {
						coord = coordseq[coord];
						lineTo(coord);
					}
				} else {
					for (coord in coordseq) {
						coord = coordseq[coord];
						if ((prevcoord[0] == coord[0] && (coord[0] == 0 || coord[0] == granularity))
								|| (prevcoord[1] == coord[1] && (coord[1] == 0 || coord[1] == granularity))) //hide boundaries
						{
							moveTo(coord);
						} else {
							lineTo(coord);
						}
					}
				}
				moveTo(firstpoint);
			}
		}
		if (val.type == "LineString") {
			if (dashes != "aaa") {
				setDashPattern(val.coordinates[0], dashes);
			}
			for (var i = 0, len = val.coordinates.length; i < len; i++) {
				coord = val.coordinates[i];
				if (dashes == "aaa") {
					lineTo(coord);
				} else {
					dashTo(coord);
				}
			}
		}
	}
	
	function textOnGeoJSON(val, halo, text) {
		if (val.type == "LineString") {
			var projcoords = new Array();
			var textwidth = 0;
			var i = 0;
			while (i < text.length) {
				var letter = text.substr(i, 1);
				textwidth += ctx.measureText(letter).width;
				i++;
			}
			var aspect = textwidth / ctx.measureText(text).width;
			for (coord in val.coordinates) {
				coord = val.coordinates[coord];
				projcoords.push([ ws * coord[0], hs * (granularity - coord[1]) ]);
			}
			//projcoords = ST_Simplify(projcoords, 1);
			var linelength = ST_Length(projcoords);
			
			if (linelength > textwidth) {
				//alert("text: "+text+" width:"+textwidth+" space:"+linelength);
				var widthused = 0;
				var i = 0;
				var prevangle = "aaa";
				var positions = new Array();
				var solution = 0;
				
				var flipcount = 0;
				var flipped = false;
				while (solution < 2) {
					if (solution == 0)
						widthused = linelength - textwidth / 2;
					if (solution == 1)
						widthused = 0;
					flipcount = 0;
					i = 0;
					prevangle = "aaa";
					positions = new Array();
					while (i < text.length) {
						var letter = text.substr(i, 1);
						var letterwidth = ctx.measureText(letter).width / aspect;
						var axy = ST_AngleAndCoordsAtLength(projcoords, widthused);
						if (widthused >= linelength || !axy) {
							//alert("cannot fit text: "+text+" widthused:"+ widthused +" width:"+textwidth+" space:"+linelength+" letter:"+letter+" aspect:"+aspect);
							solution++;
							positions = new Array();
							if (flipped) {
								projcoords.reverse();
								flipped = false;
							}
							break;
						} // cannot fit
						if (prevangle == "aaa")
							prevangle = axy[0];
						if (collides.checkPointWH([ axy[1], axy[2] ],
								2.5 * letterwidth, 2.5 * letterwidth)
								|| Math.abs(prevangle - axy[0]) > 0.2) {
							i = 0;
							positions = new Array();
							letter = text.substr(i, 1);
							widthused += letterwidth;
							continue;
						}
						/*while (letterwidth > axy[3] && i<text.length){
						  i++;
						  letter += text.substr(i,1);
						  letterwidth = ctx.measureText(letter).width;
						  if (
						    collides.checkPointWH([axy[1]+0.5*Math.cos(axy[3])*letterwidth,
						                         axy[2]+0.5*Math.sin(axy[3])*letterwidth],
						                         2.5*letterwidth,
						                         2.5*letterwidth)
						    || Math.abs(prevangle-axy[0])>0.2){
						    i = 0;
						    positions = new Array();
						    letter = text.substr(i,1);
						    break;
						  }

						}*/
						if (axy[0] > Math.PI / 2 || axy[0] < -Math.PI / 2) {
							flipcount += letter.length;
						}
						
						prevangle = axy[0];
						axy.push(letter);
						positions.push(axy);
						widthused += letterwidth;
						i++;
					}
					if (flipped && flipcount > text.length / 2) {
						projcoords.reverse();
						flipped = false;
						positions = new Array();
						solution++;
						flipcount = 0;
					}
					if (!flipped && flipcount > text.length / 2) {
						projcoords.reverse();
						flipped = true;
						positions = new Array();
					}
					if (solution >= 2) {
						return
					}
					if (positions.length > 0) {
						break;
					}
				}
				if (solution >= 2) {
					return
				}
				i = 0;
				
				while (halo && i < positions.length) {
					var axy = positions[i];
					var letter = axy[4];
					ctx.save();
					ctx.translate(axy[1], axy[2]);
					ctx.rotate(axy[0]);
					ctx.strokeText(letter, 0, 0);
					ctx.restore();
					i++;
				}
				i = 0;
				while (i < positions.length) {
					var axy = positions[i];
					var letter = axy[4];
					var letterwidth = ctx.measureText(letter).width;
					ctx.save();
					ctx.translate(axy[1], axy[2]);
					ctx.rotate(axy[0]);
					collides.addPointWH([
						axy[1] + 0.5 * Math.cos(axy[3]) * letterwidth,
						axy[2] + 0.5 * Math.sin(axy[3]) * letterwidth ],
							2.5 * letterwidth, 2.5 * letterwidth);
					//collides.addPointWH([axy[1],axy[2]],2.5*letterwidth+20,2.5*letterwidth+20);
					ctx.fillText(letter, 0, 0);
					ctx.restore();
					i++;
				}
			}
		}
	}
	
	function transformPoint(point) {
		return [ws * point[0], hs * (granularity - point[1])];
	}
	
	function moveTo(point) {
		var p2 = transformPoint(point);
		ctx.moveTo(p2[0], p2[1]);
	}
	
	function lineTo(point) {
		var p2 = transformPoint(point);
		ctx.lineTo(p2[0], p2[1]);
	}
	
	function setDashPattern(point, dashes) {
		var p2 = transformPoint(point);
		
		dashPattern = {
			Patn: dashes,
			Seg: 0,
			Phs: 0,
			X1: p2[0],
			Y1: p2[1]
		};
	}
	
	function dashTo(point) { // segment of dasked line set
		var p2 = transformPoint(point),
			X2 = p2[0],
			Y2 = p2[1];
		
		// X2 Y2 : X & Y to go TO ; internal X1 Y1 to go FROM
		// Ptrn as [6,4, 1,4] // mark-space pairs indexed by Seg
		
		var XDis, YDis, Dist, X, More, T, Ob = dashPattern;
		XDis = X2 - Ob.X1; // DeltaX
		YDis = Y2 - Ob.Y1; // DeltaY
		Dist = Math.sqrt(XDis * XDis + YDis * YDis); // length
		//if (Dist<0.00000001){return}
		ctx.save();
		ctx.translate(Ob.X1, Ob.Y1);
		ctx.rotate(Math.atan2(YDis, XDis));
		ctx.moveTo(0, 0);
		X = 0; // Now dash pattern from 0,0 to Dist,0
		do {
			T = Ob.Patn[Ob.Seg]; // Full segment
			X += T - Ob.Phs; // Move by unused seg
			More = X < Dist; // Not too far?
			if (!More) {
				Ob.Phs = T - (X - Dist);
				X = Dist;
			} // adjust
			Ob.Seg % 2 ? ctx.moveTo(X, 0) : ctx.lineTo(X, 0);
			if (More) {
				Ob.Phs = 0;
				Ob.Seg = ++Ob.Seg % Ob.Patn.length;
			}
		} while (More);
		Ob.X1 = X2;
		Ob.Y1 = Y2;
		ctx.restore();
	}

	function fontString(name, size) {
		if (!name) {
			return size + 'px Arial, Helvetica, sans-serif';
		}
		
		var family = name;
			
		size = size || 9;
		name = name.toLowerCase();
		
		var style = (name.indexOf("italic") != -1 || name.indexOf("oblique") != -1 ? 'italic' : 'normal'),
			weight = (name.indexOf("bold") != -1 ? 'bold' : 'normal'); 
		
		if (name.indexOf('serif') != -1) {
			family += ', Georgia, serif';
		} else if (name.indexOf('mono') != -1) {
			family += ', "Courier New", monospace';
		} else {
			family += ', Arial, Helvetica, sans-serif';
		}
		
		return weight + " " + style + " " + size +"px " + family;
	}
	
	
	function CollisionBuffer() {
		this.buffer = [];
	}
	
	CollisionBuffer.prototype = {
		addBox: function(box) {
			this.buffer.push(box);
		},
		
		addPointWH: function(point, w, h, d) {
			if (!d)d=0;
			this.buffer.push([point[0]-w/2-d, point[1]-h/2-d, point[0]+w/2-d, point[1]+w/2-d]);
		},
		
		checkBox: function(b) {
			for (var i = 0, len = this.buffer.length, c; i < len; i++) {
				c = this.buffer[i];
				if ((c[0]<=b[2] && c[1]<=b[3] && c[2]>=b[0] && c[3]>=b[1])) return true;
			}
			return false;
		},
		
		checkPointWH: function(point, w, h) {
			return this.checkBox([point[0]-w/2, point[1]-h/2, point[0]+w/2, point[1]+w/2]);
		}
	};
	
	function preloadIcons(urls) {
		var img, url, i, 
			len = urls.length,
			loaded = 0;
		
		Kothic.icons = {};
		
		for (i = 0; i < len; i++) {
			(function(url) {
				img = new Image();
				img.onload = function() {
					loaded++;
					Kothic.icons[url] = this;
					if (loaded == len) {
						onIconsLoad();
					}
				};
				img.src = Kothic.iconsPath + url;
			})(urls[i]);
		}
	}
	
	function onIconsLoad() {
		Kothic.onIconsLoad();
		Kothic.iconsLoaded = true;
	}
	
	function extend(dest, source) {
		for (var i in source) {
			if (source.hasOwnProperty(i)) {
				dest[i] = source[i];
			}
		}
		return dest;
	}
	
	return {
		render: render,
		
		preloadIcons: preloadIcons,
		onIconsLoad: function() {},
		iconsLoaded: false,
		iconsPath: ''
	};
})();