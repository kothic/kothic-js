var Kothic = require("./src/kothic");
var Canvas = require('canvas');
var fs = require('fs');

var style = require('./src/style/surface');

var geojson = require('./324.js').data;

var canvas = new Canvas(256 * 4, 256 * 4)
//  , ctx = canvas.getContext('2d');

var kothic = new Kothic({
  debug: true
});

kothic.render(canvas, geojson, 14, function() {
   var stream = canvas.createPNGStream();
   var file = fs.createWriteStream("./test.png");
   stream.pipe(file);
});
