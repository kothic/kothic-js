'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        MapCSS: {},
        Kothic: {
            geom: {
                getReprPoint: function(feature) {
                    return feature.coordinates;
                },
                transformPoint: function(point, ws, hs) {
                    return [point[0] * ws, point[1] * hs];
                }
            }
        }
    };

    vm.createContext(context);
    [
        'src/style/style.js',
        'src/renderer/texticons.js'
    ].forEach(function(file) {
        vm.runInContext(fs.readFileSync(file, 'utf8'), context, {
            filename: file
        });
    });

    return context;
}

function createContext2d() {
    return {
        fillTexts: [],
        fillRects: [],
        measureText: function(text) {
            return {
                width: text.length * 5
            };
        },
        fillText: function(text, x, y) {
            this.fillTexts.push([text, x, y]);
        },
        strokeText: function() {},
        fillRect: function(x, y, width, height) {
            this.fillRects.push([x, y, width, height]);
        }
    };
}

function createCollisionBuffer() {
    return {
        boxes: [],
        checkPointWH: function() {
            return false;
        },
        addPointWH: function(point, width, height, padding, id) {
            this.boxes.push([point, width, height, padding, id]);
        }
    };
}

function runTests() {
    var context = createContext(),
        ctx = createContext2d(),
        collisions = createCollisionBuffer();

    context.Kothic.texticons.render(ctx, {
        kothicId: 1,
        type: 'Point',
        coordinates: [50, 50],
        style: {
            text: 'Old Town Hall',
            'font-size': 10,
            'max-width': 45,
            'text-decoration': 'underline'
        }
    }, collisions, 1, 1, true, false);

    assert.deepStrictEqual(ctx.fillTexts.map(function(call) {
        return call[0];
    }), ['Old Town', 'Hall']);
    assert.strictEqual(ctx.fillRects.length, 2);
    assert.strictEqual(ctx.fillRects[0][2], 40);
    assert.strictEqual(ctx.fillRects[1][2], 20);
    assert.strictEqual(collisions.boxes[0][1], 40);
    assert.strictEqual(collisions.boxes[0][2], 24);
    assert.deepEqual(context.Kothic.texticons.wrapText(ctx, 'Short', 45), ['Short']);
}

runTests();
