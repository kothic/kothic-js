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
        texts: [],
        measureText: function(text) {
            return {
                width: text.length * 10
            };
        },
        translate: function() {},
        rotate: function() {},
        fillText: function(text) {
            this.texts.push(text);
        },
        strokeText: function() {}
    };
}

function createCollisionBuffer() {
    return {
        checkPointWH: function() {
            return false;
        },
        addPoints: function() {},
        addPointWH: function() {}
    };
}

function runTests() {
    var context = createContext(),
        ctx = createContext2d();

    assert.strictEqual(context.Kothic.textOnPath(ctx, [[0, 0], [10, 0]], 'Long label', false, createCollisionBuffer()), false);

    context.Kothic.texticons.render(ctx, {
        kothicId: 1,
        type: 'MultiLineString',
        coordinates: [
            [[0, 0], [10, 0]],
            [[0, 50], [200, 50]]
        ],
        style: {
            text: 'Main Road'
        }
    }, createCollisionBuffer(), 1, 1, true, false);

    assert.deepStrictEqual(ctx.texts, ['Main Road']);
}

runTests();
