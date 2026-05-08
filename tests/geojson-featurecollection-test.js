'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        console: console,
        window: {
            devicePixelRatio: 1,
            requestAnimationFrame: function(fn) {
                fn();
            }
        },
        document: {
            getElementById: function() {
                return null;
            },
            createElement: function() {
                return {
                    width: 0,
                    height: 0,
                    getContext: function() {
                        return {
                            drawImage: function() {}
                        };
                    }
                };
            }
        },
        Image: function Image() {}
    };

    context.window.window = context.window;
    context.window.document = context.document;
    context.window.Image = context.Image;
    context.window.console = context.console;
    context.global = context;

    vm.createContext(context);
    vm.runInContext(fs.readFileSync('dist/kothic.js', 'utf8'), context, {
        filename: 'dist/kothic.js'
    });

    return context;
}

function runTests() {
    var context = createContext(),
        Kothic = context.Kothic,
        geojson = {
            type: 'FeatureCollection',
            granularity: 10000,
            features: [
                {
                    type: 'Feature',
                    id: 'road-1',
                    properties: {
                        highway: 'residential'
                    },
                    geometry: {
                        type: 'LineString',
                        coordinates: [[10, 20], [30, 40]]
                    },
                    reprpoint: [20, 30]
                },
                {
                    type: 'Feature',
                    properties: null,
                    geometry: {
                        type: 'Point',
                        coordinates: [50, 60]
                    }
                },
                {
                    type: 'Feature',
                    properties: {
                        ignored: true
                    },
                    geometry: null
                }
            ]
        },
        normalized = Kothic.normalizeData(geojson);

    assert.notStrictEqual(normalized, geojson);
    assert.strictEqual(normalized.granularity, 10000);
    assert.strictEqual(normalized.features.length, 2);
    assert.deepEqual(normalized.features[0], {
        type: 'LineString',
        coordinates: [[10, 20], [30, 40]],
        properties: {
            highway: 'residential'
        },
        id: 'road-1',
        reprpoint: [20, 30]
    });
    assert.deepEqual(normalized.features[1], {
        type: 'Point',
        coordinates: [50, 60],
        properties: {}
    });

    normalized.features[0].coordinates[0][1] = 999;
    normalized.features[0].reprpoint[1] = 999;
    assert.deepStrictEqual(geojson.features[0].geometry.coordinates, [[10, 20], [30, 40]]);
    assert.deepStrictEqual(geojson.features[0].reprpoint, [20, 30]);

    assert.strictEqual(Kothic.normalizeData(normalized), normalized);
}

runTests();
