var Kothic = require("./src/kothic");
var fs = require('fs');
const { createCanvas, loadImage } = require('canvas')

var style = require('./src/style/surface');

const geojson = JSON.parse(fs.readFileSync('./N42E074-merc.json'));

const canvas = createCanvas(10000, 10000)

var kothic = new Kothic({
  debug: true,
});

//console.log(Object.keys(geojson));

bbox = [8237642.32, 5160979.44, 8348961.81, 5311971.85];

kothic.render(canvas, geojson, 13, bbox, function() {
   var stream = canvas.createPNGStream();
   var file = fs.createWriteStream("./test.png");
   stream.pipe(file);
});
