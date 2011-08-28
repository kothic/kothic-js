/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */
 
Kothic.Debug = K.Class.extend({
    initialize: function () {
        this.stats = {};
        this.events = [{
            message: 'initialized',
            timestamp: +new Date()
        }];
    },
    
    setStats: function (map) {
        for (var key in map) {
            if (map.hasOwnProperty(key)) {
                this.stats[key] = map[key];
            }
        }
    },
    
    addEvent: function (message) {
        this.events.push({
            message: message,
            timestamp: +new Date()
        });
    }
});
