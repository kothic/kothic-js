'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext() {
    var context = {};

    vm.createContext(context);
    vm.runInContext(fs.readFileSync('src/style/mapcss.js', 'utf8'), context, {
        filename: 'src/style/mapcss.js'
    });

    return context;
}

function runTests() {
    var context = createContext(),
        MapCSS = context.MapCSS;

    assert.strictEqual(MapCSS.e_transliterate('Минск'), 'Minsk');
    assert.strictEqual(MapCSS.e_transliterate('Гомель-Цэнтральны'), 'Gomel-Tsentralny');
    assert.strictEqual(MapCSS.e_transliterate('Львів'), 'Lviv');

    MapCSS.locales = ['en'];
    assert.strictEqual(MapCSS.e_localize({
        name: 'Минск'
    }, 'name'), 'Minsk');

    MapCSS.locales = ['en-US'];
    assert.strictEqual(MapCSS.e_localize({
        name: 'Минск'
    }, 'name'), 'Minsk');

    MapCSS.locales = ['be', 'en'];
    assert.strictEqual(MapCSS.e_localize({
        name: 'Минск',
        'name:be': 'Мінск'
    }, 'name'), 'Мінск');

    MapCSS.locales = ['en'];
    assert.strictEqual(MapCSS.e_localize({
        name: 'Минск',
        'name:en': 'Minsk City'
    }, 'name'), 'Minsk City');

    MapCSS.locales = ['ru'];
    assert.strictEqual(MapCSS.e_localize({
        name: 'Минск'
    }, 'name'), 'Минск');
}

runTests();
