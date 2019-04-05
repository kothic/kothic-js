const fs = require('fs');
const {createCanvas} = require('canvas')

function getImageCore() {
  const canvas = createCanvas(20, 20)
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f00';
  ctx.ellipse(10, 10, 5, 5, 0, 0, 2*Math.PI);
  ctx.fill();
  return canvas;
}

function getImageBackground() {
  const canvas = createCanvas(25, 25)
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(0, 0, 0, 0)';
  ctx.rect(0, 0, 25, 25);
  ctx.fill();
  return canvas;
}

const ops = [
  'source-over',
  // 'source-in',
  // 'source-out',
  // 'source-atop',
  // 'destination-over',
  // 'destination-in',
  // 'destination-out',
  // 'destination-atop',
  // 'lighter',
  // 'copy',
  // 'xor',
  // 'multiply',
  // 'screen',
  // 'overlay',
  // 'darken',
  // 'lighten',
  // 'color-dodge',
  // 'color-burn',
  // 'hard-light',
  // 'soft-light',
  // 'difference',
  // 'exclusion',
  // 'hue',
  // 'saturation',
  // 'color',
  // 'luminosity'
]

const canvas = createCanvas(ops.length * 25 + 15, 400)
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#aaf'
ctx.fillRect(0, 0, canvas.width, canvas.height);

for (let i = 0; i < ops.length; i++) {
  const x = 10 + i * 25
  ctx.fillStyle = '#fff'
  for (let j = 0; j < 10; j++) {
    const y = 10 + j * 25;
    ctx.rect(x, y, 20, 20)
    ctx.fill();
  }
}
ctx.closePath();

ctx.font = '14px sans-serif'
ctx.fillStyle = '#000'
ctx.textBaseline = 'middle';
for (let i = 0; i < ops.length; i++) {
  const x = 10 + i * 25
  const w = ctx.measureText('' + i).width;
  ctx.fillText(i, x - w/2 + 20 / 2, 20);
  ctx.closePath();
}

ctx.globalCompositeOperation = 'copy';
const img = getImageCore();
for (let i = 0; i < ops.length; i++) {
  const x = 10 + i * 25
  const y = 10 + 25;

  ctx.save()
  ctx.rect(x, y, 20, 20);
  ctx.clip();
  ctx.drawImage(img, x, y);
  ctx.closePath();
  ctx.restore();
}

const bg = getImageBackground();
for (let i = 0; i < ops.length; i++) {
  const x = 10 + i * 25
  const y = 10 + 2 * 25;

  ctx.save()
  ctx.rect(x, y, 20, 20);
  ctx.clip();
  ctx.drawImage(bg, x, y);
  ctx.closePath();
  ctx.restore();
}

//  ctx.restore()
  // ctx.moveTo(x, 20);
  //
  // ctx.ellipse(x, 20, 5, 5, 0, 0, 2*Math.PI);
  // ctx.fill();
  //
  // ctx.moveTo(-x, -20);
//}

// ctx.globalCompositeOperation = 'copy'
// ctx.strokeStyle = "rgba(0,0,0,0)"
// ctx.lineWidth = 5;
// ctx.fillStyle = "black"
// ctx.font = '40px sans-serif';
// ctx.strokeText("OK", 200, 100)
// ctx.fillText("OK", 200, 100)
//ctx.globalCompositeOperation = 'source-over'
// loadImage("../../sandbox/maki/png/triangle-15.png").then((image) => {
//   ctx.save();
//   ctx.beginPath();
//   ctx.strokeStyle = 'black'
//   ctx.lineWidth = 1
//   ctx.ellipse(200 + 15/2, 200 + 15/2, 10, 10, 0, 0, 2*Math.PI);
//   //ctx.stroke();
//   ctx.clip("evenodd");
//   ctx.drawImage(image, 200, 200);
//   ctx.restore();
//   // ctx.drawImage(image, 220, 200);
//   // ctx.drawImage(image, 240, 200);
//
// })
const stream = canvas.createPNGStream();
const file = fs.createWriteStream("./test.png");
stream.pipe(file);
