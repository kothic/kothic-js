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
        document: {
            getElementById: function() {}
        },
        MapCSS: {
            imagesLoaded: true,
            renderQueue: [],
            restyle: function() {
                return {};
            }
        },
        window: {
            devicePixelRatio: 2,
            requestAnimationFrame: function(callback) {
                callback();
            }
        },
        rbush: function() {
            return {
                insert: function() {},
                load: function() {},
                search: function() {
                    return [];
                }
            };
        }
    };

    vm.createContext(context);
    [
        'src/kothic.js',
        'src/style/style.js',
        'src/renderer/polygon.js',
        'src/utils/collisions.js'
    ].forEach(function(file) {
        vm.runInContext(fs.readFileSync(file, 'utf8'), context, {
            filename: file
        });
    });
    return context;
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

function createFluidCanvas() {
    var canvas = createCanvas();
    canvas.style.width = '100%';
    canvas.style.height = '12em';
    canvas.clientWidth = 320;
    canvas.clientHeight = 180;
    return canvas;
}

function renderOnce(context, canvas) {
    context.Kothic.render(canvas, {
        granularity: 10000,
        features: []
    }, 13, {
        styles: [],
        onRenderComplete: function() {}
    });
}

function runTests() {
    var context = createContext(),
        canvas = createCanvas();

    renderOnce(context, canvas);
    assert.strictEqual(canvas.width, 512);
    assert.strictEqual(canvas.height, 512);
    assert.strictEqual(canvas.style.width, '256px');
    assert.strictEqual(canvas.style.height, '256px');

    renderOnce(context, canvas);
    assert.strictEqual(canvas.width, 512);
    assert.strictEqual(canvas.height, 512);
    assert.strictEqual(canvas.style.width, '256px');
    assert.strictEqual(canvas.style.height, '256px');

    // Caller resizes the canvas attributes between renders: the new size wins.
    canvas.width = 300;
    canvas.height = 200;
    renderOnce(context, canvas);
    assert.strictEqual(canvas.width, 600);
    assert.strictEqual(canvas.height, 400);
    assert.strictEqual(canvas.style.width, '300px');
    assert.strictEqual(canvas.style.height, '200px');

    renderOnce(context, canvas);
    assert.strictEqual(canvas.width, 600);
    assert.strictEqual(canvas.height, 400);

    canvas = createFluidCanvas();
    renderOnce(context, canvas);
    assert.strictEqual(canvas.width, 640);
    assert.strictEqual(canvas.height, 360);
    assert.strictEqual(canvas.style.width, '100%');
    assert.strictEqual(canvas.style.height, '12em');

    renderOnce(context, canvas);
    assert.strictEqual(canvas.width, 640);
    assert.strictEqual(canvas.height, 360);
    assert.strictEqual(canvas.style.width, '100%');
    assert.strictEqual(canvas.style.height, '12em');
}

runTests();
