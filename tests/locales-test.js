'use strict';

var assert = require('assert'),
    fs = require('fs'),
    vm = require('vm');

function createContext(navigatorValue) {
    var context = {
        window: {
            navigator: navigatorValue
        }
    };

    vm.createContext(context);
    vm.runInContext(fs.readFileSync('src/kothic.js', 'utf8'), context, {
        filename: 'src/kothic.js'
    });
    vm.runInContext(fs.readFileSync('src/style/mapcss.js', 'utf8'), context, {
        filename: 'src/style/mapcss.js'
    });

    return context;
}

function runTests() {
    var context = createContext({
            languages: ['ru-RU', 'be', 'en_US']
        }),
        fallbackContext = createContext({
            userLanguage: 'de-DE'
        });

    assert.deepEqual(context.Kothic.getDefaultLocales(), ['ru-RU', 'ru', 'be', 'en-US', 'en']);
    context.MapCSS.locales = context.Kothic.getDefaultLocales();
    assert.strictEqual(context.MapCSS.e_localize({
        name: 'Default',
        'name:ru': 'Russian',
        'name:en': 'English'
    }, 'name'), 'Russian');

    assert.deepEqual(fallbackContext.Kothic.getDefaultLocales(), ['de-DE', 'de']);
    assert.deepEqual(createContext(null).Kothic.getDefaultLocales(), []);
}

runTests();
