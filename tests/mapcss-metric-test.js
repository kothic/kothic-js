'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        Math: Math,
        isFinite: isFinite,
        parseFloat: parseFloat,
        parseInt: parseInt,
        String: String
    };

    vm.createContext(context);
    vm.runInContext(fs.readFileSync('src/style/mapcss.js', 'utf8'), context, {
        filename: 'src/style/mapcss.js'
    });
    return context;
}

function assertClose(actual, expected) {
    assert(Math.abs(actual - expected) < 1e-9, actual + ' must be close to ' + expected);
}

function runTests() {
    var context = createContext(),
        MapCSS = context.MapCSS,
        equatorPixels,
        northPixels,
        equatorKey,
        northKey;

    assert.strictEqual(MapCSS.e_metric('3m'), 3);
    assert.strictEqual(MapCSS.e_zmetric('3m'), 3);

    MapCSS.setMetricContext({
        bbox: [0, -0.5, 1, 0.5]
    }, 0, 256);
    equatorPixels = MapCSS.e_metric('1000m');
    assertClose(equatorPixels, 1000 / (111319.49079327357 / 256));
    assertClose(MapCSS.e_metric('1km'), equatorPixels);
    assertClose(MapCSS.e_metric('100000cm'), equatorPixels);
    equatorKey = MapCSS.getTagKeys({}, 10, 'way', 'line');

    MapCSS.setMetricContext({
        bbox: [0, 59.5, 1, 60.5]
    }, 0, 256);
    northPixels = MapCSS.e_metric('1000m');
    assert(northPixels > equatorPixels * 1.9);
    assertClose(MapCSS.e_zmetric('1000m'), northPixels);
    northKey = MapCSS.getTagKeys({}, 10, 'way', 'line');
    assert.notStrictEqual(northKey, equatorKey);

    assert.strictEqual(MapCSS.e_metric('12'), 12);
    assert.strictEqual(MapCSS.e_metric('nonsense'), NaN);
}

runTests();
