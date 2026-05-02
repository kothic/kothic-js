/* eslint-env node */
'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function extend(props) {
    var Parent = this;

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
    context.L.GridLayer.extend = extend;
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
        clickHandler;

    layer.onAdd(map);
    assert.strictEqual(typeof map.handlers.click, 'function');
    clickHandler = map.handlers.click;

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

    layer.onRemove(map);
    assert.strictEqual(map.handlers.click, undefined);
    assert.strictEqual(map.removedHandlers.click, clickHandler);
    assert.deepStrictEqual(Object.keys(layer._data), []);
}

runTests();
