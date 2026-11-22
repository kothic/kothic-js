'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        Math: Math,
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
        moves: [],
        lines: [],
        moveTo: function(x, y) {
            this.moves.push([x, y]);
        },
        lineTo: function(x, y) {
            this.lines.push([x, y]);
        },
        setLineDash: function() {}
    };
}

function runTests() {
    var context = createContext(),
        ctx = createContext2d(),
        feature = {
            type: 'LineString',
            coordinates: [[0, 50], [100, 50]]
        };

    context.Kothic.path(ctx, feature, null, false, 1, 1, 100);

    assert.deepStrictEqual(feature.coordinates, [[0, 50], [100, 50]]);
    assert(ctx.moves[0][0] < 0);
    assert(ctx.lines[0][0] > 100);
}

runTests();
