'use strict';

var Circle = function () {
  function Circle() {
    for (var _len = arguments.length, arg = Array(_len), _key = 0; _key < _len; _key++)
      arg[_key] = arguments[_key];

    var x = arg.shift();
    if (x instanceof Vector) {
      this.center = x;
    } else {
      this.center = new Vector(x, arg.shift());
    }
    this.radius = arg.shift();
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