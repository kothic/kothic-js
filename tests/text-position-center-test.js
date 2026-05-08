'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        Math: Math,
        MapCSS: {},
        Kothic: {}
    };

    vm.createContext(context);
    [
        'src/utils/geom.js',
        'src/style/style.js',
        'src/renderer/text.js',
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
        pathTexts: [],
        transformed: false,
        measureText: function(text) {
            return {
                width: text.length * 5
            };
        },
        fillText: function(text, x, y) {
            if (this.transformed) {
                this.pathTexts.push(text);
            } else {
                this.fillTexts.push([text, x, y]);
            }
        },
        strokeText: function() {},
        translate: function(x, y) {
            if (x || y) {
                this.transformed = true;
            }
        },
        rotate: function(angle) {
            if (angle) {
                this.transformed = true;
            }
        }
    };
}

function createCollisionBuffer() {
    return {
        checkPointWH: function() {
            return false;
        },
        addPointWH: function() {},
        addPoints: function() {}
    };
}

function renderLine(context, style) {
    var ctx = createContext2d();

    context.Kothic.texticons.render(ctx, {
        kothicId: 1,
        type: 'LineString',
        coordinates: [[0, 0], [100, 0]],
        style: style
    }, createCollisionBuffer(), 1, 1, true, false);

    return ctx;
}

function runTests() {
    var context = createContext(),
        centered = renderLine(context, {
            text: 'Center',
            'text-position': 'center'
        }),
        along = renderLine(context, {
            text: 'Along'
        });

    assert.deepStrictEqual(centered.fillTexts, [['Center', 50, 0]]);
    assert.deepStrictEqual(centered.pathTexts, []);
    assert.deepStrictEqual(along.fillTexts, []);
    assert.deepStrictEqual(along.pathTexts, ['Along']);
}

runTests();
