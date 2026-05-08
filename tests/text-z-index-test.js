'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {
        console: console,
        MapCSS: {}
    };

    vm.createContext(context);
    vm.runInContext(fs.readFileSync('src/kothic.js', 'utf8'), context, {
        filename: 'src/kothic.js'
    });

    context.Kothic.texticons = {
        render: function(ctx, feature, collisionBuffer) {
            var style = feature.style;

            if (style['allow-overlap'] !== 'true' &&
                    collisionBuffer.checkPointWH([50, 50], 20, 20, feature.kothicId)) {
                return;
            }

            collisionBuffer.addPointWH([50, 50], 20, 20, 0, feature.kothicId);
            ctx.fillText(style.label, 0, 0);
        }
    };
    context.Kothic.shields = {
        render: function() {}
    };

    return context;
}

function createContext2d() {
    return {
        labels: [],
        measureText: function(text) {
            return {
                width: text.length
            };
        },
        fillText: function(text) {
            this.labels.push(text);
        }
    };
}

function createCollisionBuffer() {
    return {
        boxes: [],
        checkPointWH: function(point, width, height, id) {
            return this.boxes.some(function(box) {
                return box.id !== id;
            });
        },
        addPointWH: function(point, width, height, padding, id) {
            this.boxes.push({
                id: id
            });
        }
    };
}

function renderLabels(context, features) {
    var ctx = createContext2d();

    context.Kothic._renderTextAndIcons(['0'], {
        '0': features
    }, ctx, 1, 1, createCollisionBuffer());

    return ctx.labels;
}

function runTests() {
    var context = createContext();

    assert.deepStrictEqual(renderLabels(context, [
        {
            kothicId: 1,
            style: {
                label: 'low icon',
                'icon-image': 'low',
                zIndex: 1
            }
        },
        {
            kothicId: 2,
            style: {
                label: 'high text',
                text: 'high',
                zIndex: 2
            }
        }
    ]), ['high text']);

    assert.deepStrictEqual(renderLabels(context, [
        {
            kothicId: 1,
            style: {
                label: 'low',
                text: 'low',
                'allow-overlap': 'true',
                zIndex: 1
            }
        },
        {
            kothicId: 2,
            style: {
                label: 'high',
                text: 'high',
                'allow-overlap': 'true',
                zIndex: 2
            }
        }
    ]), ['low', 'high']);
}

runTests();
