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
var kothic = new Kothic({
            buffered: false,  // (optional) if true, result will appear only after all layers are rendered
            styles: ['osmosnimki-maps', 'surface'], // (optional) only specified styles will be rendered, if any
            locales: ['be', 'ru', 'en'] // (optional) map languages, see below
        });
```

`locales` Kothic-JS supports map localization based on name:*lang* tags. Renderer will check all mentioned languages in order of persence.  If object doesn't have localized name, *name* tag will be used. 

Tile rendering:

```javascript
kothic.render(
	canvas, // canvas element (or its id) to render on
	data, // JSON data to render
	zoom, // zoom level
	onRenderComplete, // (optional) callback to call when rendering is done
	);
```

Note: you should new renderer instance for any tile you want to render since Kothic has unsolved concurrency issues. 

### Contributing to Kothic JS

Kothic JS is licensed under a BSD license, and we'll be glad to accept your contributions! Please send your pull requests to one of the guys below.

#### Core contributors:

Darafei Praliaskouski ([@Komzpa](https://github.com/Komzpa)), Vladimir Agafonkin ([@mourner](https://github.com/mourner)), Maksim Gurtovenko ([@Miroff](https://github.com/Miroff))
