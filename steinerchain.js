var getCircles = function(n, focus) {
  var circles = [];
  if (n < 7)
  {
    var childRadius = 1/3.0;
    circles.push(new Circle(0, 0, 1-2*childRadius));
    var pathRadius = 1 - childRadius;
    var childAngle = Math.PI/Math.max(n, 3);
    var addAngle = 2 * Math.PI/n;
    for (var i = 0; i < n; i++) {
      var x = Math.sin(childAngle);
      var y = Math.sqrt(1-x*x);
      if (childAngle < Math.PI/2 || childAngle > 3 * Math.PI/2)
        y *= -1;
      circles.push(new Circle(pathRadius * x, pathRadius * y, childRadius));
      childAngle += addAngle;
    }
    return circles;
  }

  var focusCircle = new Circle(focus.mul(-.5), 0.5);
  var s = Math.sin(Math.PI / n);
  var r = (1 - s) / (1 + s);
  var rc = (1 - r) / 2;
  var rr = (1 + r) / 2;
  var inc = new Circle(0, 0, r);
  var out = new Circle(0, 0, 1);
  circles.push(out);
  var inc2 = focusCircle.invert(inc);
  var rap = 1 / inc2.radius * 0.7;
  var ctr2 = inc2.center.mul(rap);
  for (var i = 0; i < n; i++) {
    var childAngle = i / n * Math.PI * 2;
    var ctr = Vector.polar(rr, childAngle);
    var circle = new Circle(ctr, rc);
    circles.push(circle);
  }
  var invertedCircles = [];
  circles.forEach(function (circle) {
    invertedCircle = focusCircle.invert(circle);
    invertedCircle = invertedCircle.mul(rap);
    invertedCircle.center = invertedCircle.center.sub(ctr2);
    invertedCircles.push(invertedCircle);
  });

  return invertedCircles;
}
