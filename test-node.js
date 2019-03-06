var Kothic = require("./src/kothic");
var fs = require('fs');
const { createCanvas, loadImage } = require('canvas')

var style = require('./src/style/surface');

var geojson = require('./324.js').data;

const canvas = createCanvas(200, 200)

var kothic = new Kothic({
  debug: true
});

kothic.render(canvas, geojson, 14, function() {
   var stream = canvas.createPNGStream();
   var file = fs.createWriteStream("./test.png");
   stream.pipe(file);
});
