**Kothic JS** is a full-featured JavaScript map rendering engine using HTML5 Canvas.
It was initially developed as a JavaScript port of [Kothic](http://wiki.openstreetmap.org/wiki/Kothic) rendering engine written in Python.

Check out the demo: http://kothic.org/

### Maintenance status

Kothic JS is a legacy runtime and compatibility target for existing Canvas
rendering integrations. The maintained MapCSS-to-Kothic JS converter now lives
in [`kothic/kothic`](https://github.com/kothic/kothic) and emits
`MapCSS.loadStyle(...)` style modules for this runtime.

Large new features should come as fresh source-level pull requests with a
working demo or focused tests. Old feature requests and stale demo reports may
be closed as historical unless someone is actively maintaining that path.

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

Run the local checks with:

```
npm test
```

The test suite builds Kothic, runs the Leaflet clickable-layer smoke test, and
compares a browser-rendered canvas fixture with a checked-in PNG baseline using
`pixelmatch`. The `pretest` step installs the Playwright Chromium binary when it
is missing. To intentionally refresh the render baseline, run:

```
UPDATE_RENDER_FIXTURES=1 node tests/render-pixelmatch-test.js
```

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

### Leaflet tile debugging

`L.TileLayer.Kothic` accepts a `debugTiles: true` option. When enabled, each
tile canvas gets a semi-transparent overlay with the tile `z/x/y`, data URL,
load status, and rendered feature count. This is useful when a map shows a mix
of rendered and gray tiles and you need to see whether the JSON tile failed to
load or rendering completed.

The same events are available from `layer.getDebugMessages()` for tests or
custom debug panels.

### Contributing to Kothic JS

Kothic JS is licensed under a BSD license, and we'll be glad to accept your contributions!

#### Core contributors:

 * Darafei Praliaskouski ([@Komzpa](https://github.com/Komzpa))
 * Vladimir Agafonkin ([@mourner](https://github.com/mourner), creator of [Leaflet](http://leafletjs.com))
 * Maksim Gurtovenko ([@Miroff](https://github.com/Miroff))

 * Leaflet 1.x compatibility, Stephan Brandt ([@braandl](https://github.com/braandl))
