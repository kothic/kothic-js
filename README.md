**Kothic JS** is a full-featured JavaScript map rendering engine using HTML5 Canvas.
It was initially developed as a JavaScript port of [Kothic](http://wiki.openstreetmap.org/wiki/Kothic) rendering engine written in Python.

Check out the demo: http://kothic.org/

### Features

 * Rendering [OpenStreetMap](http://openstreetmap.org) data visually on par with [Mapnik](http://mapnik.org)
 * [MapCSS](http://wiki.openstreetmap.org/wiki/MapCSS/0.2) support (see [How to Prepare a Map Style](https://github.com/kothic/kothic-js/wiki/How-to-prepare-map-style))
 * rendering from lightweight GeoJSON-like tiles (see [Tiles Format](https://github.com/kothic/kothic-js/wiki/Tiles-format))
 * easy integration with [Leaflet](http://leaflet.cloudmade.com) (interactive maps library)

### Building Kothic

Install Node.js, then run:

```
npm install
npm install -g grunt-cli
grunt
```

Minified Kothic source will be generated in the `dist` folder.

### Basic usage

Include `kothic.js` from the `dist` folder on your page. Now you can call:

```javascript
Kothic.render(
	canvas, // canvas element (or its id) to render on
	data, // JSON data to render
	zoom, // zoom level
	{
		onRenderComplete: callback, // (optional) callback to call when rendering is done
    	styles: ['osmosnimki-maps', 'surface'], // (optional) only specified styles will be rendered, if any
    	locales: ['be', 'ru', 'en'] // (optional) map languages, see below
	});
```

`locales` Kothic-JS supports map localization based on name:*lang* tags. Renderer will check all mentioned languages in order of persence.  If object doesn't have localized name, *name* tag will be used.

### Contributing to Kothic JS

Kothic JS is licensed under a BSD license, and we'll be glad to accept your contributions!

#### Core contributors:

 * Darafei Praliaskouski ([@Komzpa](https://github.com/Komzpa))
 * Vladimir Agafonkin ([@mourner](https://github.com/mourner), creator of [Leaflet](http://leafletjs.com))
 * Maksim Gurtovenko ([@Miroff](https://github.com/Miroff))

 * Leaflet 1.x compatibility, Stephan Brandt ([@braandl](https://github.com/braandl))