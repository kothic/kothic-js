/**
 * @preserve Copyright (c) 2011, Darafei Praliaskouski, Vladimir Agafonkin, Maksim Gurtovenko
 * Kothic JS is a full-featured JavaScript map rendering engine using HTML5 Canvas.
 * See http://github.com/kothic/kothic-js for more information.
 */

Array.prototype.remove = function(elem) {
     var index = this.indexOf(elem);
     if (index >= 0) {
         this.splice(index, 1);
         delete this[index];
     }
};
