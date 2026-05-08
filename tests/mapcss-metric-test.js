'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        console: {
            time: function() {},
            timeEnd: function() {}
        },
        Math: Math,
        isFinite: isFinite,
        parseFloat: parseFloat,
        parseInt: parseInt,
        String: String,
        window: {}
    };

    context.window.requestAnimationFrame = function(fn) {
        context.frames.push(fn);
    };
    context.frames = [];
    vm.createContext(context);
    vm.runInContext(fs.readFileSync('src/style/mapcss.js', 'utf8'), context, {
        filename: 'src/style/mapcss.js'
    });
    return context;
}

function loadRenderer(context) {
    vm.runInContext(fs.readFileSync('src/kothic.js', 'utf8'), context, {
        filename: 'src/kothic.js'
    });
    context.MapCSS.imagesLoaded = true;
    context.Kothic.CollisionBuffer = function CollisionBuffer() {};
    context.Kothic.style = {
        defaultCanvasStyles: {},
        setStyles: function() {},
        populateLayers: function(features, zoom, styles) {
            context.MapCSS.restyle(styles, {}, zoom, 'way', 'line');
            return {
                0: features
            };
        }
    };
    context.Kothic.polygon = {
        fill: function() {}
    };
    context.Kothic._renderGeometryFeatures = function() {};
    context.Kothic._renderTextAndIcons = function() {};
}

function createCanvas() {
    return {
        width: 256,
        height: 256,
        style: {},
        getContext: function() {
            return {
                scale: function() {},
                fillRect: function() {}
            };
        }
    };
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

    MapCSS.metricContext = {
        metersPerPixel: 2,
        cacheKey: 'outer'
    };
    assert.strictEqual(MapCSS.withMetricContext({
        metersPerPixel: 4,
        cacheKey: 'inner'
    }, function() {
        assert.strictEqual(MapCSS.metricContext.cacheKey, 'inner');
        return MapCSS.e_metric('8m');
    }), 2);
    assert.strictEqual(MapCSS.metricContext.cacheKey, 'outer');
}

function runRenderScopeTests() {
    var context = createContext(),
        MapCSS = context.MapCSS,
        records = [],
        originalRestyle,
        equatorKey,
        northKey;

    loadRenderer(context);
    originalRestyle = MapCSS.restyle;
    MapCSS.restyle = function(styleNames, tags, zoom, type, selector) {
        records.push({
            type: type,
            selector: selector,
            key: MapCSS.metricContext && MapCSS.metricContext.cacheKey
        });
        return originalRestyle.call(MapCSS, styleNames, tags, zoom, type, selector);
    };
    MapCSS.loadStyle('metric-test', function(actions) {
        return actions;
    });

    context.Kothic.render(createCanvas(), {
        granularity: 10000,
        bbox: [0, -0.5, 1, 0.5],
        features: []
    }, 10, {
        styles: ['metric-test']
    });
    equatorKey = records[0].key;

    context.Kothic.render(createCanvas(), {
        granularity: 10000,
        bbox: [0, 59.5, 1, 60.5],
        features: []
    }, 10, {
        styles: ['metric-test']
    });
    northKey = records[1].key;

    assert.notStrictEqual(northKey, equatorKey);
    context.frames.shift()();
    assert.strictEqual(records[2].type, 'canvas');
    assert.strictEqual(records[2].selector, 'canvas');
    assert.strictEqual(records[2].key, equatorKey);
    context.frames.shift()();
    context.frames.shift()();
    assert.strictEqual(records[3].type, 'canvas');
    assert.strictEqual(records[3].selector, 'canvas');
    assert.strictEqual(records[3].key, northKey);
}

runTests();
runRenderScopeTests();
