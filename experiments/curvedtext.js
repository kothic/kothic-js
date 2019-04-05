const curvedtext = require("./src/renderer/curvedtext.js");
const textonpath = require("./src/renderer/textonpath.js");
const CollisionBuffer = require("./src/utils/collisions");

const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

const canvas = createCanvas(250, 250);

const ctx = canvas.getContext("2d");

//const points = [[10, 10], [50, 60], [90, 70], [120, 70], [200, 100], [240, 150]].reverse();

const points = [];
const r = 100
const center = [125, 125];
const n = 9
const a0 = 0 //(-Math.PI/2)
for (var i = 0; i <= n; i++) {
  const a = a0 + 2 * Math.PI * i / n;
  points.push([center[0] + r * Math.cos(a), center[1] + r * Math.sin(a)])
}

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, 250, 250);

ctx.strokeStyle = 'black';
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(points[0][0], points[0][1]);
for (var i = 0; i < points.length; i++) {
  ctx.lineTo(points[i][0], points[i][1]);
}
ctx.fillStyle = "#ff0000"
ctx.stroke();
ctx.fill();

ctx.font = "20px sans-serif";
ctx.fillStyle = "black";
ctx.textBaseline = 'middle'

// ctx.translate(100, 100)
// ctx.rotate(rad(45));
// ctx.fillText("Test", -50, 0)
// ctx.rotate(-rad(45));
// ctx.translate(-100, -100)
// ctx.fillText("Test", 0, 0)

curvedtext.render(ctx, points, "Japan", false, new CollisionBuffer(), true);
//textonpath.textOnPath(ctx, points, "Agamemnon");

const stream = canvas.createPNGStream();
const file = fs.createWriteStream("./test.png");

stream.pipe(file);
