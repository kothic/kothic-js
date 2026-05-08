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
        draws: [],
        font: '10px sans-serif',
        globalAlpha: 1,
        labels: [],
        save: function() {
            this.savedAlpha = this.globalAlpha;
            this.savedFont = this.font;
        },
        restore: function() {
            this.globalAlpha = this.savedAlpha;
            this.font = this.savedFont;
        },
        measureText: function(text) {
            return {
                width: text.length * parseInt(this.font, 10)
            };
        },
        fillText: function(text) {
            this.labels.push(text);
        },
        drawImage: function() {
            this.draws.push(this.globalAlpha);
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
    var context = createContext(),
        ctx = createContext2d(),
        recorder = context.Kothic._recordCanvasCommands(ctx);

    recorder.ctx.font = '24px sans-serif';
    assert.strictEqual(recorder.ctx.measureText('wide').width, 96);
    assert.strictEqual(ctx.font, '10px sans-serif');
    recorder.replay();
    assert.strictEqual(ctx.font, '10px sans-serif');

    var translucent = context.Kothic._recordCanvasCommands(ctx),
        icon = context.Kothic._recordCanvasCommands(ctx);

    translucent.ctx.globalAlpha = 0.35;
    translucent.ctx.fillText('label', 0, 0);
    icon.ctx.drawImage({}, 0, 0);
    translucent.replay();
    icon.replay();
    assert.deepStrictEqual(ctx.draws, [1]);
    assert.strictEqual(ctx.globalAlpha, 1);

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
