var mouse = undefined;

var tree = 
{
	name: "Root",
	children: 
	[
		{
			name: "child1",
			children: 
			[
				{
					name: "grandchild1",
					children: []
				},
				{
					name: "grandchild2",
					children: []
				},
				{
					name: "grandchild3",
					children: []
				},
			]
		},
		{
			name: "child2",
			children: 
			[
				{
					name: "grandchild1",
					children: []
				},
				{
					name: "grandchild2",
					children: []
				},
			]
		},
		{
			name: "child3",
			children: 
			[
				{
					name: "grandchild1",
					children: []
				},
				{
					name: "grandchild2",
					children: []
				},
				{
					name: "grandchild3",
					children: []
				},
				{
					name: "grandchild4",
					children: []
				},
				{
					name: "grandchild5",
					children: []
				},
				{
					name: "grandchild6",
					children: []
				},
				{
					name: "grandchild7",
					children: []
				},
				{
					name: "grandchild8",
					children: []
				},
				{
					name: "grandchild9",
					children: []
				},
				{
					name: "grandchild10",
					children: []
				},
				{
					name: "grandchild11",
					children: []
				},
				{
					name: "grandchild12",
					children: []
				},
			]
		},
		{
			name: "child4",
			children: 
			[
				{
					name: "grandchild1",
					children: []
				},
				{
					name: "grandchild2",
					children: []
				},
				{
					name: "grandchild3",
					children: 
					[
						{
							name: "grandgrandchild1",
							children: []
						},
						{
							name: "grandgrandchild2",
							children: []
						},
						{
							name: "grandgrandchild3",
							children: []
						},
						{
							name: "grandgrandchild4",
							children: []
						},
						{
							name: "grandgrandchild5",
							children: []
						},
						{
							name: "grandgrandchild6",
							children: []
						},
						{
							name: "grandgrandchild7",
							children: []
						}
					]
				},
				{
					name: "grandchild4",
					children: []
				},
			]
		},
		{
			name: "child5",
			children: 
			[
				{
					name: "grandchild1",
					children: []
				},
				{
					name: "grandchild2",
					children: []
				},
				{
					name: "grandchild3",
					children: []
				},
				{
					name: "grandchild4",
					children: []
				},
				{
					name: "grandchild5",
					children: []
				},
			]
		},
	]
};

var draw = function() {
	var panel = $("#panel");
	var ctx = panel[0].getContext('2d');
	bounds = createBounds(0, 0, panel.width(), panel.height());
	mouse = mouse || new Vector(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
	drawTree(ctx, bounds, tree);
}

var drawTree = function(ctx, bounds, tree) {
	var focus = new Vector(0.2, 0.2);
	var circles = getCircles(tree.children.length, focus);
	drawNode(ctx, bounds, circles[0]);
	drawChildren(ctx, bounds, tree.children, circles.slice(1));
}

var drawNode = function(ctx, bounds, innerCircle) {
	drawShape(ctx, bounds, innerCircle);
	drawName(ctx, bounds);
}

var drawShape = function(ctx, bounds, circle) {
	var outerRadX = bounds.width/2;
	var outerRadY = bounds.height/2;
	var innerRadX = outerRadX*circle.radius;
	var innerRadY = outerRadY*circle.radius;
	var x = outerRadX * (1 + circle.center.x);
	var y = outerRadY * (1 + circle.center.y);
	drawOval(ctx, bounds.x + x, bounds.y + y, innerRadX, innerRadY);
}

var drawOval = function(ctx, x, y, xRad, yRad) {
	ctx.beginPath();
	ctx.ellipse(x, y, xRad, yRad, 0, 0, 2 * Math.PI);
	ctx.stroke();	
}

var drawName = function(ctx, bounds) {
}

var drawChildren = function(ctx, bounds, children, childCircles) {
	var n = children.length;
	if (n == 0) return;
	var scaleX = bounds.width/2;
	var scaleY = bounds.height/2;
	var centerX = bounds.x + scaleX;
	var centerY = bounds.y + scaleY;
	for (var i = 0; i < n; i++)
		drawTree(ctx, computeChildBounds(centerX, centerY, scaleX, scaleY, childCircles[i]), children[i]);
}

var computeChildBounds = function(centerX, centerY, scaleX, scaleY, childCircle) {
	var x = centerX + scaleX * childCircle.center.x;
	var y = centerY + scaleY * childCircle.center.y;
	var radX = scaleX * childCircle.radius;
	var radY = scaleY * childCircle.radius;
	return createBounds(x - radX, y - radY, 2 * radX, 2 * radY);
}

var createBounds = function(x, y, width, height) {
	return {x: x, y: y, width: width, height: height};
}

$(document).ready(draw);
/*
window.addEventListener('mousemove', function (e) {
  mouse = new Vector(e.pageX, e.pageY);
  draw();
});
*/
