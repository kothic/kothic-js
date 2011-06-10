**Kothic JS** is a full-featured JavaScript map rendering engine using HTML5 Canvas. 
It was initially developed as a JavaScript port of [Kothic](http://wiki.openstreetmap.org/wiki/Kothic) rendering engine written in Python.

### Features

 * Rendering [OpenStreetMap](http://openstreetmap.org) data visually on par with [Mapnik](http://mapnik.org)
 * [MapCSS](http://wiki.openstreetmap.org/wiki/MapCSS/0.2) support (see [How to Prepare a Map Style](https://github.com/kothic/kothic-js/wiki/How-to-prepare-map-style))
 * rendering from lightweight GeoJSON-like tiles (see [Tiles Format](https://github.com/kothic/kothic-js/wiki/Tiles-format))
 * easy integration with [Leaflet](http://leaflet.cloudmade.com) (interacrive maps library)

### Basic usage

Include `kothic.js` from the `dist` directory on your page. Now you can call:

```javascript
Kothic.render(
	canvas, // canvas element (or its id) to render on
	data, // JSON data to render
	zoom, // zoom level
	additionalStyle, // (optional) explained below
	onRenderComplete, // (optional) callback to call when rendering is done
	buffered // (optional) if true, result will appear only after all layers are rendered
	);
```

`additionalStyle` is a function of the following form (for example):

```javascript
function(style, tags, zoom, type, selector) {
	if (tags.building == 'yes' && !tags['addr:housename']) {
		style['default']['fill-color'] = 'red';
	} 
}
```

### Contributing to Kothic JS

Kothic JS is licensed under a BSD license, and we'll be glad to accept your contributions! Please send your pull requests to one of the guys below.

#### Core contributors:

Darafei Praliaskouski ([@Komzpa](https://github.com/Komzpa)), Vladimir Agafonkin ([@mourner](https://github.com/mourner)), Maksim Gurtovenko ([@Miroff](https://github.com/Miroff))