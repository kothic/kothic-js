const fs = require('fs');
const {createCanvas, loadImage} = require('canvas')

const canvas = createCanvas(400, 400)

const ctx = canvas.getContext('2d');

ctx.fillStyle = '#fee'
ctx.fillRect(0, 0, 400, 400);

ctx.globalCompositeOperation = 'copy'
ctx.strokeStyle = "rgba(0,0,0,0)"
ctx.lineWidth = 5;
ctx.fillStyle = "black"
ctx.font = '40px sans-serif';
ctx.strokeText("OK", 200, 100)
ctx.fillText("OK", 200, 100)
//ctx.globalCompositeOperation = 'source-over'
loadImage("../../sandbox/maki/png/triangle-15.png").then((image) => {

  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 1
  ctx.ellipse(200 + 15/2, 200 + 15/2, 10, 10, 0, 0, 2*Math.PI);
  //ctx.stroke();
  ctx.clip("evenodd");
  ctx.drawImage(image, 200, 200);
  ctx.restore();
  // ctx.drawImage(image, 220, 200);
  // ctx.drawImage(image, 240, 200);

  const stream = canvas.createPNGStream();
  const file = fs.createWriteStream("./test.png");
  stream.pipe(file);
})
