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
        });

    assert.strictEqual(solid.strokes, 1);
    assert.strictEqual(solid.beginPaths, 1);
    assert.strictEqual(dashed.strokes, 2);
    assert.strictEqual(dashed.beginPaths, 2);
    assert.deepStrictEqual(dashed.dashes, [[6, 4], [6, 4]]);
}

runTests();
