var Kothic = require("./src/kothic");
var fs = require('fs');
const { createCanvas, loadImage } = require('canvas')

// var style = require('./src/style/surface');

const geojson = JSON.parse(fs.readFileSync('./N52E083.json'));
geojson.bbox = [83, 52, 84, 53];

const canvas = createCanvas(1000, 1000)

const css = fs.readFileSync("./contours.mapcss").toString();

var kothic = new Kothic({
  css: css,
  //Synchronous mode for testing reasons
  getFrame: (callback) => callback()
});

console.time("rendering")
kothic.render(canvas, geojson, 13, function() {
  console.timeEnd("rendering")
  console.time("saving")
  const stream = canvas.createPNGStream();
  const file = fs.createWriteStream("./test.png");

  stream.pipe(file);
  stream.on('end', () => console.timeEnd("saving"))
});
