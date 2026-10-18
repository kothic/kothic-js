'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        isFinite: isFinite,
        parseFloat: parseFloat,
        Kothic: {
            geom: {
                transformPoint: function(point, ws, hs) {
                    return [point[0] * ws, point[1] * hs];
                }
            },
            style: {
                setStyles: function(ctx, styles) {
                    Object.keys(styles).forEach(function(key) {
                        ctx[key] = styles[key];
                    });
                }
            }
        }
    };

    vm.createContext(context);
    [
        'src/renderer/path.js',
        'src/renderer/line.js'
    ].forEach(function(file) {
        vm.runInContext(fs.readFileSync(file, 'utf8'), context, {
            filename: file
        });
    });

    return context;
}

function createContext2d() {
    return {
        strokes: 0,
        beginPaths: 0,
        dashes: [],
        beginPath: function() {
            this.beginPaths++;
        },
        moveTo: function() {},
        lineTo: function() {},
        setLineDash: function(dashes) {
            this.dashes.push(Array.prototype.slice.call(dashes));
        },
        stroke: function() {
            this.strokes++;
        }
    };
}

function createFeature(style) {
    return {
        type: 'LineString',
        coordinates: [[10, 10], [90, 90]],
        style: style
    };
}

function renderPair(context, style) {
    var ctx = createContext2d(),
        first = createFeature(style),
        second = createFeature(style);

    context.Kothic.line.render(ctx, first, second, 1, 1, 100);
    context.Kothic.line.render(ctx, second, null, 1, 1, 100);

    return ctx;
}

function renderCasingPair(context, style) {
    var ctx = createContext2d(),
        first = createFeature(style),
        second = createFeature(style);

    context.Kothic.line.renderCasing(ctx, first, second, 1, 1, 100);
    context.Kothic.line.renderCasing(ctx, second, null, 1, 1, 100);

    return ctx;
}

function runTests() {
    var context = createContext(),
        solid = renderPair(context, {
            width: 2,
            color: '#333333'
        }),
        dashed = renderPair(context, {
            width: 2,
            color: '#333333',
            dashes: [6, 4]
        }),
        zeroDashes = renderPair(context, {
            width: 2,
            color: '#333333',
            dashes: [0, 0]
        }),
        mixedZeroDashes = renderPair(context, {
            width: 2,
            color: '#333333',
            dashes: [0, 2]
        }),
        nonNumericDashes = renderPair(context, {
            width: 2,
            color: '#333333',
            dashes: ['bad', 2]
        }),
        zeroCasingDashes = renderCasingPair(context, {
            width: 2,
            color: '#333333',
            'casing-width': 1,
            'casing-color': '#ffffff',
            'casing-dashes': [0, 0]
        }),
        dashedCasing = renderCasingPair(context, {
            width: 2,
            color: '#333333',
            'casing-width': 1,
            'casing-color': '#ffffff',
            'casing-dashes': [6, 4]
        });

    assert.strictEqual(solid.strokes, 1);
    assert.strictEqual(solid.beginPaths, 1);
    assert.strictEqual(dashed.strokes, 2);
    assert.strictEqual(dashed.beginPaths, 2);
    assert.deepStrictEqual(dashed.dashes, [[6, 4], [6, 4]]);
    assert.strictEqual(zeroDashes.strokes, 1);
    assert.strictEqual(zeroDashes.beginPaths, 1);
    assert.deepStrictEqual(zeroDashes.dashes, [[], []]);
    assert.strictEqual(mixedZeroDashes.strokes, 1);
    assert.strictEqual(mixedZeroDashes.beginPaths, 1);
    assert.deepStrictEqual(mixedZeroDashes.dashes, [[], []]);
    assert.strictEqual(nonNumericDashes.strokes, 1);
    assert.strictEqual(nonNumericDashes.beginPaths, 1);
    assert.deepStrictEqual(nonNumericDashes.dashes, [[], []]);
    assert.strictEqual(zeroCasingDashes.strokes, 1);
    assert.strictEqual(zeroCasingDashes.beginPaths, 1);
    assert.deepStrictEqual(zeroCasingDashes.dashes, [[], []]);
    assert.strictEqual(dashedCasing.strokes, 2);
    assert.strictEqual(dashedCasing.beginPaths, 2);
    assert.deepStrictEqual(dashedCasing.dashes, [[6, 4], [6, 4]]);
}

runTests();
