var Kothic = require("./src/kothic");
var fs = require('fs');

var MapCSS = require("./src/style/mapcss");

const { createCanvas, loadImage } = require('canvas')

const canvas = createCanvas(1000, 1000)

const css = fs.readFileSync("./contours.mapcss").toString();

const mapcss = new MapCSS(css, {
  cache: {},
  locales: []
});

var kothic = new Kothic(mapcss, {
  //Synchronous mode for testing reasons
  getFrame: (callback) => callback()
});

const geojson = JSON.parse(fs.readFileSync('./N42E074.json'));
geojson.bbox = [74, 42, 75, 43];

console.time("rendering")
kothic.render(canvas, geojson, 13, function() {
  console.timeEnd("rendering")
  console.time("saving")
  const stream = canvas.createPNGStream();
  const file = fs.createWriteStream("./test.png");

  stream.pipe(file);
  stream.on('end', () => console.timeEnd("saving"))
});
