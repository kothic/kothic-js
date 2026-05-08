'use strict';

var assert = require('assert'),
    fs = require('fs'),
    test = require('node:test'),
    vm = require('vm');

function extend(props) {
    var Parent = this;

    /** @this {any} */
    function Child() {
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }
    }

    Child.prototype = Object.create(Parent.prototype);
    Child.prototype.constructor = Child;
    Object.keys(props).forEach(function(key) {
        Child.prototype[key] = props[key];
    });
    Child.extend = extend;
    return Child;
}

function createContext() {
    var events = [],
        context = {
            console: console,
            window: null,
            MapCSS: {
                availableStyles: [],
                invalidateCache: function() {}
            },
            Kothic: {
                render: function(canvas, data, zoom, options) {
                    if (options && options.onRenderComplete) {
                        options.onRenderComplete();
                    }
                }
            },
            L: {
                Util: {
                    setOptions: function(obj, options) {
                        obj.options = Object.assign(
                            {},
                            Object.getPrototypeOf(obj).options || {},
                            options || {}
                        );
                    },
                    bind: function(fn, obj) {
                        return fn.bind(obj);
                    }
                },
                Point: function Point(x, y) {
                    this.x = x;
                    this.y = y;
                },
                DomUtil: {
                    create: function() {
                        return {};
                    }
                },
                GridLayer: function GridLayer() {},
                TileLayer: {}
            }
        };

    context.window = context;
    context.L.GridLayer.prototype = {
        on: function(name, handler) {
            this._layerHandlers = this._layerHandlers || {};
            this._layerHandlers[name] = handler;
        },
        off: function(name, handler) {
            this._removedLayerHandlers = this._removedLayerHandlers || {};
            this._removedLayerHandlers[name] = handler;
            delete this._layerHandlers[name];
        },
        onAdd: function(map) {
            this._map = map;
        },
        onRemove: function() {
            delete this._map;
        },
        fire: function(name, payload) {
            events.push({
                name: name,
                payload: payload
            });
        }
    };
    /** @type {any} */ (context.L.GridLayer).extend = extend;
    context.events = events;

    vm.createContext(context);
    vm.runInContext(fs.readFileSync('dist/kothic-leaflet.js', 'utf8'), context, {
        filename: 'dist/kothic-leaflet.js'
    });
    vm.runInContext(fs.readFileSync('dist/kothic-leaflet-clickable.js', 'utf8'), context, {
        filename: 'dist/kothic-leaflet-clickable.js'
    });

    return context;
}

function createMap(pixel) {
    return {
        handlers: {},
        removedHandlers: {},
        on: function(name, handler) {
            this.handlers[name] = handler;
        },
        off: function(name, handler) {
            this.removedHandlers[name] = handler;
            delete this.handlers[name];
        },
        getZoom: function() {
            return 13;
        },
        project: function() {
            return {
                x: pixel.x,
                y: pixel.y
            };
        },
        unproject: function(point) {
            return {
                lat: point.y,
                lng: point.x
            };
        }
    };
}

function createDebugCanvas() {
    var calls = [],
        ctx = {
            save: function() {
                calls.push(['save']);
            },
            restore: function() {
                calls.push(['restore']);
            },
            fillRect: function(x, y, width, height) {
                calls.push(['fillRect', x, y, width, height]);
            },
            fillText: function(text, x, y) {
                calls.push(['fillText', text, x, y]);
            }
        };

    return {
        width: 256,
        height: 256,
        calls: calls,
        getContext: function() {
            return ctx;
        }
    };
}

function getFilledTexts(canvas) {
    return canvas.calls.filter(function(call) {
        return call[0] === 'fillText';
    }).map(function(call) {
        return call[1];
    });
}

function runTests() {
    var context = createContext(),
        Layer = context.L.TileLayer.Kothic.Clickable,
        layer = new Layer('/{z}/{x}/{y}.json', {
            tileSize: 256,
            zoomOffset: 0
        }),
        map = createMap({
            x: 2 * 256 + 25,
            y: 3 * 256 + 51
        }),
        clickHandler,
        tileUnloadHandler;

    layer.onAdd(map);
    assert.strictEqual(typeof map.handlers.click, 'function');
    clickHandler = map.handlers.click;
    assert.strictEqual(typeof layer._layerHandlers.tileunload, 'function');
    tileUnloadHandler = layer._layerHandlers.tileunload;

    assert.doesNotThrow(function() {
        map.handlers.click({
            latlng: {}
        });
    });
    assert.strictEqual(context.events.length, 0);

    layer._canvases['13/2/3'] = {};
    layer._onKothicDataResponse({
        granularity: 10000,
        features: [
            {
                id: 'near',
                type: 'Point',
                coordinates: [976.5625, 8007.8125]
            },
            {
                id: 'line',
                type: 'LineString',
                coordinates: [[0, 0], [1, 1]]
            },
            {
                id: 'far',
                type: 'Point',
                coordinates: [5000, 5000]
            }
        ]
    }, 13, 2, 3, function done() {});

    map.handlers.click({
        latlng: {}
    });

    assert.strictEqual(context.events.length, 1);
    assert.strictEqual(context.events[0].name, 'featureclick');
    assert.strictEqual(context.events[0].payload.feature.id, 'near');
    assert.deepStrictEqual(context.events[0].payload.latlng, {
        lat: 819,
        lng: 537
    });
    assert.strictEqual(layer._data['13/2/3'].features.length, 2);

    layer._layerHandlers.tileunload({
        coords: {
            z: 13,
            x: 2,
            y: 3
        }
    });
    assert.strictEqual(layer._data['13/2/3'], undefined);

    layer._canvases['13/2/3'] = {};
    layer._onKothicDataResponse({
        granularity: 10000,
        features: [
            {
                id: 'near',
                type: 'Point',
                coordinates: [976.5625, 8007.8125]
            }
        ]
    }, 13, 2, 3, function done() {});

    layer.onRemove(map);
    assert.strictEqual(map.handlers.click, undefined);
    assert.strictEqual(map.removedHandlers.click, clickHandler);
    assert.strictEqual(layer._layerHandlers.tileunload, undefined);
    assert.strictEqual(layer._removedLayerHandlers.tileunload, tileUnloadHandler);
    assert.deepStrictEqual(Object.keys(layer._data), []);
}

test('clickable Leaflet layer finds nearby point features and cleans up handlers', function() {
    runTests();
});

function runDebugTileTests() {
    var context = createContext(),
        Layer = context.L.TileLayer.Kothic,
        layer = new Layer('/tiles/{z}/{x}/{y}.json', {
            debugTiles: true,
            styles: []
        }),
        canvas = createDebugCanvas(),
        doneArgs = [],
        texts;

    layer._loadJSON = function(url, zoom, x, y, done) {
        assert.strictEqual(url, '/tiles/13/2/3.json');
        assert.strictEqual(zoom, 13);
        assert.strictEqual(x, 2);
        assert.strictEqual(y, 3);
        assert.strictEqual(typeof done, 'function');
    };
    layer.drawTile(canvas, {
        x: 2,
        y: 3
    }, 13, function done(error, tile) {
        doneArgs = [error, tile];
    });

    assert.strictEqual(layer.getDebugMessages()[0].status, 'loading');
    assert.strictEqual(layer.getDebugMessages()[0].url, '/tiles/13/2/3.json');
    texts = getFilledTexts(canvas);
    assert(texts.indexOf('Kothic 13/2/3') >= 0);
    assert(texts.indexOf('loading') >= 0);

    context.window.onKothicDataResponse({
        granularity: 10000,
        features: []
    }, 13, 2, 3, function done(error, tile) {
        doneArgs = [error, tile];
    });

    assert.strictEqual(doneArgs[0], undefined);
    assert.strictEqual(doneArgs[1], canvas);
    assert.strictEqual(layer.getDebugMessages()[1].status, 'data loaded');
    assert.strictEqual(layer.getDebugMessages()[2].status, 'rendered');
    texts = getFilledTexts(canvas);
    assert(texts.indexOf('0 features') >= 0);
    assert.strictEqual(layer._canvases['13/2/3'], undefined);

    canvas = createDebugCanvas();
    layer._canvases['13/4/5'] = canvas;
    context.window.onKothicDataError('/tiles/13/4/5.json', 13, 4, 5, 404, function done(error, tile) {
        doneArgs = [error, tile];
    });

    assert.strictEqual(doneArgs[0].message, 'Kothic tile data request failed: 404 /tiles/13/4/5.json');
    assert.strictEqual(doneArgs[1], canvas);
    assert.strictEqual(layer.getDebugMessages()[3].status, 'data error 404');
    texts = getFilledTexts(canvas);
    assert(texts.indexOf('Kothic 13/4/5') >= 0);
    assert(texts.indexOf('data error 404') >= 0);
    assert.strictEqual(layer._canvases['13/4/5'], undefined);
}

test('debug Leaflet layer reports tile status and failures', function() {
    runDebugTileTests();
});
