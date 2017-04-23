var mouse = undefined;

var draw = function() {
	var panel = $("#panel");
	var ctx = panel[0].getContext('2d');
	ctx.fillStyle = '#FFF';
  	ctx.fillRect(0, 0, panel.width(), panel.height());
  	var outer = createOval(panel.width() / 2, panel.height() / 2, panel.width() / 2, panel.height() / 2);
	mouse = mouse || new Vector(outer.x, outer.y);
	drawTree(ctx, outer, testTree);
}

var drawTree = function(ctx, outer, tree) {
	var focus = computeFocus(outer);
	var circles = getCircles(tree.children.length, focus);
	drawNode(ctx, outer, circles[0]);
	drawChildren(ctx, outer, tree.children, circles.slice(1));
}

var computeFocus = function(outer) {
	var x = (outer.x - mouse.x) / outer.xRadius;
	var y = (outer.y - mouse.y) / outer.xRadius;
	var radius = Math.sqrt(x * x + y * y);
	if (radius > 1 + minParentRadius)
		return new Vector(0, 0);
	if (radius < minParentRadius)
		return new Vector(x, y);
	var factor = minParentRadius / radius;
	if (radius > 1)
		factor = factor * (1 - (radius - 1) / minParentRadius); 
	x = x * factor;
	y = y * factor;
	return new Vector(x, y);
}

var drawNode = function(ctx, outer, circle) {
	var oval = computeOval(outer, circle);
	drawOval(ctx, oval);
	drawName(ctx, outer);
}

var drawOval = function(ctx, oval) {
	ctx.beginPath();
	ctx.ellipse(oval.x, oval.y, oval.xRadius, oval.yRadius, 0, 0, 2 * Math.PI);
	ctx.stroke();	
}

var drawName = function(ctx, outer) {
}

var drawChildren = function(ctx, outer, children, childCircles) {
	var n = children.length;
	if (n == 0) return;
	for (var i = 0; i < n; i++)
		drawTree(ctx, computeOval(outer, childCircles[i]), children[i]);
}

var computeOval = function(outer, circle) {
	return createOval(outer.x + outer.xRadius * circle.center.x
		, outer.y + outer.yRadius * circle.center.y
		, outer.xRadius * circle.radius
		, outer.yRadius * circle.radius);
}

var createOval = function(x, y, xRad, yRad) {
	return {x: x, y: y, xRadius: xRad, yRadius: yRad};
}

$(document).ready(function() {
	draw();
	$(document).mousemove(function( e ) {
	  mouse = new Vector(e.pageX, e.pageY);
	  draw();
	});
});
