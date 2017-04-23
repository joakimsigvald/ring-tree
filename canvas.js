var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
var win = undefined;
var mid = undefined;
var scale = undefined;
var n = 5;
var init = Date.now();
var mouse = new Vector(0, 0);
var ctrl = {};
var reqAF = undefined;
function resize() {
  win = new Vector(window.innerWidth, window.innerHeight);
  mid = win.div(2);
  canvas.width = win.x;
  canvas.height = win.y;
  scale = Math.min(mid.x, mid.y);
  draw();
}
window.addEventListener('resize', resize);
resize();
function loop() {
  draw();
  window.requestAnimationFrame(loop);
}
loop();

function draw() {
  if (reqAF) return;
  reqAF = window.requestAnimationFrame(_draw);
}

function _draw() {
  reqAF = null;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, win.x, win.y);
  var circles = getCircles(n, mouse);
  circles.forEach(drawCircle);
}

function drawPoint(p, col) {
  var s = 3;
  p = mid.add(p.mul(scale));
  ctx.beginPath();
  ctx.strokeStyle = col || '#acf';
  ctx.moveTo(p.x - s, p.y);
  ctx.lineTo(p.x + s, p.y);
  ctx.moveTo(p.x, p.y - s);
  ctx.lineTo(p.x, p.y + s);
  ctx.stroke();
}

function drawCircle(c) {
  ctx.beginPath();
  ctx.strokeStyle = c.color;
  var ctr = mid.add(c.center.mul(scale));
  ctx.arc(ctr.x, ctr.y, scale * c.radius, 0, Math.PI * 2, 1);
  ctx.stroke();
}