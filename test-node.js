const Kothic = require("./src/kothic");
const fs = require('fs');

const MapCSS = require("./src/style/mapcss");

const { createCanvas, loadImage } = require('canvas')

const canvas = createCanvas(1000, 1000)

const css = fs.readFileSync("./contours.mapcss").toString();

const mapcss = new MapCSS(css, {
  cache: {},
  locales: []
});

var kothic = new Kothic(mapcss, {
  //Synchronous mode for testing reasons
  getFrame: (callback) => callback(),
  browserOptimizations: false,
  debug: true
});

console.time("Loading GeoJSON");
const geojson = JSON.parse(fs.readFileSync('../../sandbox/relief/contours-json/N52E085.json'));
geojson.bbox = [85, 52, 85.1, 52.1];
console.timeEnd("Loading GeoJSON");

console.time("Rendering")
kothic.render(canvas, geojson, 13, function() {
  console.timeEnd("Rendering")
  console.time("Saving PNG")
  const stream = canvas.createPNGStream();
  const file = fs.createWriteStream("./test.png");

  stream.pipe(file);
  stream.on('end', () => console.timeEnd("Saving PNG"))
});
