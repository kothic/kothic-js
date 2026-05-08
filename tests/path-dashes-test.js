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
            }
        }
    };

    vm.createContext(context);
    vm.runInContext(fs.readFileSync('src/renderer/path.js', 'utf8'), context, {
        filename: 'src/renderer/path.js'
    });
    return context;
}

function createContext2d() {
    return {
        dashes: [],
        moveTo: function() {},
        lineTo: function() {},
        setLineDash: function(dashes) {
            this.dashes.push(dashes);
        }
    };
}

function renderLine(context, dashes) {
    var ctx = createContext2d();

    context.Kothic.path(ctx, {
        type: 'LineString',
        coordinates: [[10, 10], [90, 90]]
    }, dashes, false, 1, 1, 100);

    return Array.prototype.slice.call(ctx.dashes[0]);
}

function runTests() {
    var context = createContext(),
        valid = [4, 2];

    assert.deepStrictEqual(renderLine(context, [0, 0]), []);
    assert.deepStrictEqual(renderLine(context, [0, 2]), []);
    assert.deepStrictEqual(renderLine(context, ['bad', 2]), []);
    assert.deepStrictEqual(renderLine(context, null), []);
    assert.deepStrictEqual(renderLine(context, valid), valid);
}

runTests();
