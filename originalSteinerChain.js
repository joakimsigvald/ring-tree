'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vector = function () {
  "use strict";

  var Vector = function () {
    function Vector() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      _classCallCheck(this, Vector);

      this.x = x;
      this.y = y;
    }

    Vector.polar = function polar() {
      var r = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var t = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

      return new Vector(r * Math.cos(t), r * Math.sin(t));
    };

    Vector.prototype.arr = function arr() {
      return [this.x, this.y];
    };

    Vector.prototype.add = function add(v) {
      return new Vector(this.x + v.x, this.y + v.y);
    };

    Vector.prototype.sub = function sub(v) {
      return new Vector(this.x - v.x, this.y - v.y);
    };

    Vector.prototype.mul = function mul(a) {
      return new Vector(this.x * a, this.y * a);
    };

    Vector.prototype.div = function div(a) {
      return new Vector(this.x / a, this.y / a);
    };

    Vector.prototype.mix = function mix(v, a) {
      return this.mul(1 - a).add(v.mul(a));
    };

    Vector.prototype.angle = function angle() {
      var _angle = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (_angle === null) return Math.atan2(this.y, this.x);
      if (_angle instanceof Vector) return this.angle() - _angle.angle();
      return Vector.polar(this.len(), _angle);
    };

    Vector.prototype.rotate = function rotate(angle) {
      return Vector.polar(this.len(), this.angle() + angle);
    };

    Vector.prototype.len2 = function len2() {
      return this.x * this.x + this.y * this.y;
    };

    Vector.prototype.len = function len() {
      var a = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      var len = Math.sqrt(this.len2());
      if (a === null) return len;
      return this.mul(a / len);
    };

    Vector.prototype.norm = function norm() {
      return this.len(1);
    };

    Vector.prototype.dist2 = function dist2(v) {
      return this.sub(v).len2();
    };

    Vector.prototype.dist = function dist(v) {
      return this.sub(v).len();
    };

    Vector.prototype.dot = function dot(v) {
      return this.x * v.x + this.y * v.y;
    };

    Vector.prototype.cross = function cross(v) {
      return this.x * v.y - this.y * v.x;
    };

    return Vector;
  }();

  Vector.deg = Math.PI / 180;
  Vector.turn = Math.PI * 2;
  return Vector;
}();

;

var Circle = function () {
  /**
  new Circle(center: vector    , radius:number, color:string)
  new Circle(x:number, y:number, radius:number, color:string)
  **/

  function Circle() {
    _classCallCheck(this, Circle);

    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    var x = arg.shift();
    if (x instanceof Vector) {
      this.center = x;
    } else {
      this.center = new Vector(x, arg.shift());
    }
    this.radius = arg.shift();
    this.color = arg.shift();
    if (this.color == null) {
      this.color = '#fff';
    }
  }

  Circle.prototype.mul = function mul(a) {
    return new Circle(this.center.mul(a), this.radius * a, this.color);
  };

  Circle.prototype.invert = function invert(v) {
    if (v instanceof Circle) {
      return this.invertCircle(v);
    }
    var l1 = this.center.dist(v);
    var l2 = this.radius * this.radius / l1;
    return v.sub(this.center).len(l2).add(this.center);
  };

  Circle.prototype.invertCircle = function invertCircle(c) {
    var c2 = c.center.sub(this.center);
    var a = c2.angle();
    c2 = c.center.add(Vector.polar(c.radius, a));
    var c3 = c.center.add(Vector.polar(c.radius, a + Math.PI));
    c2 = this.invert(c2);
    c3 = this.invert(c3);

    var ctr = c2.mix(c3, 0.5);
    var r = ctr.dist(c2);
    return new Circle(ctr, r, c.color);
  };

  Circle.prototype.inverterCircle = function inverterCircle(c) {
    var c2 = c.center.sub(this.center);
    var a = c2.angle();
    c2 = c.center.add(Vector.polar(c.radius, a));
    var c3 = c.center.add(Vector.polar(c.radius, a + Math.PI));
    c2 = this.invert(c2);
    c3 = this.invert(c3);

    var ctr = c2.mix(c3, 0.5);
    var r = ctr.dist(c2);
    return new Circle(ctr, r, c.color);
  };

  Circle.prototype.points = function points(n) {
    var arr = [];
    for (var i = 0; i < n; i++) {
      arr.push(this.center.add(Vector.polar(this.radius, Math.PI * 2 * i / n)));
    }
    return arr;
  };

  return Circle;
}();

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
var win = undefined;
var mid = undefined;
var scale = undefined;
var n = 7;
var init = Date.now();
var mouse = new Vector(0, -0.35);
var circles = new Set();
var ctrl = {};
var ctrlFunc = {
  speed: function speed(v) {
    var now = Date.now();
    var oldSpeed = ctrl.speed || 1;
    v = Math.pow(v, 3) / 100;
    var cur = (now - init) * oldSpeed;
    var diff = cur * v / oldSpeed;
    if (v === 0) {
      init = now;
    } else {
      init = now - (now - init) * oldSpeed / v;
    }
    //init = (now - init) * (oldSpeed - v)
    return v;
  }
};
var reqAF = undefined;
Array.prototype.forEach.call(document.querySelectorAll(".ctrl input"), function (inp) {
  function change() {
    var val = inp.value;
    if (inp.type === 'checkbox') val = inp.checked;
    if (inp.type === 'range' || inp.type === 'number') val = +val;
    if (inp.name in ctrlFunc) val = ctrlFunc[inp.name](val);
    ctrl[inp.name] = val;
    draw();
  }
  change();
  inp.addEventListener('input', change);
  inp.addEventListener('change', change);
});
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
window.addEventListener('mousemove', function (e) {
  mouse = new Vector(e.pageX, e.pageY).sub(mid).div(scale);
  draw();
});

window.addEventListener('wheel', function (e) {
  e.preventDefault();
  var d = e.deltaY;
  if (!d) {
    return;
  }
  d = d < 0 ? -1 : 1;
  if (e.ctrlKey) {
    d /= 10;
  } else {
    n = Math.round(n);
  }
  n = n + d;
  if (n < 3) {
    n = 3;
  }
  draw();
});
function loop() {
  draw();
  window.requestAnimationFrame(loop);
}
loop();

function draw() {
  if (reqAF) return;
  //window.cancelAnimationFrame(reqAF)
  reqAF = window.requestAnimationFrame(_draw);
  //try{
  //  _draw()
  //}catch(e){}
}

function _draw() {
  reqAF = null;
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, win.x, win.y);
  circles.clear();
  var out = new Circle(0, 0, 1, '#fff');
  circles.add(out);
  var s = Math.sin(Math.PI / n);
  var r = (1 - s) / (1 + s);
  var rc = (1 - r) / 2;
  var rr = (1 + r) / 2;
  var inc = new Circle(0, 0, r, '#fff');
  circles.add(inc);
  var mouseCircle = new Circle(mouse.mul(ctrl.inversion ? 1 : -.5), ctrl.inversion ? 0.5 * 0.7 : 0.5, "#444");
  for (var i = 0; i < n; i++) {
    var angle = i / n * Math.PI * 2 + (Date.now() - init) * ctrl.speed;
    var ctr = Vector.polar(rr, angle);
    var hue = (i + 0.5) / n * 360;
    circles.add(new Circle(ctr, rc, 'hsl(' + hue + ',100%,50%)'));
  }
  var inc2 = mouseCircle.invert(inc);
  var rap = out.radius / inc2.radius * 0.7;
  var ctr2 = inc2.center.mul(rap);
  circles.forEach(function (c) {
    if (ctrl.inversion) {
      c = c.mul(0.7);
      ctx.globalAlpha = 0.25;
      drawCircle(c);
      ctx.globalAlpha = 1;
    }
    c = mouseCircle.invert(c);
    if (!ctrl.inversion) {
      c = c.mul(rap);
      c.center = c.center.sub(ctr2);
    }
    drawCircle(c);
  });
  if (ctrl.inversion) {
    ctx.setLineDash([5, 5]);
    drawCircle(mouseCircle);
    ctx.setLineDash([]);
  }
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
  if (ctrl.centers) {
    ctx.strokeStyle = '#999';
    drawPoint(c.center);
  }
}