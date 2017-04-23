'use strict';

var Vector = function () { //test

  var Vector = function () {
    function Vector() {
      var x = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      var y = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
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