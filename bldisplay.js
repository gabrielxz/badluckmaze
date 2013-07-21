display = new Object();
displayPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
///////////////////////// -- PUBLIC CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

display.newModalCover = function() {
	var item = new createjs.Shape();
	item.name = 'Modal';
	item.w = stage.canvas.width;
	item.h = stage.canvas.height;
	item.graphics.f('FFFFFF').r(0, 0, item.w, item.h);
	item.alpha = 0.5;

	return item;
}

display.createSpacer = function(width, height) {
	this.w = width;
	this.h = height;
	this.align = 'spacer';
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC FUNCTIONS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

display.max = function(vals) {
	return Math.max.apply(Math, vals);
}

display.sum = function(vals) {
	return vals.reduce(function(p, c, i, arr){return p+c;}, 0);
}

display.vertical = function(container, items, gap, border) {
	var loc;
	displayPriv.container_prep(container, items, gap, border);
	container.w = container.w_max;
	container.h = container.h_sum;

	loc = border;
	for(var i in items) {
		items[i].x = items[i].x_steady;
		items[i].y = items[i].y_flow;
	}
}

display.horizontal = function(container, items, gap, border) {
	var loc;
	displayPriv.container_prep(container, items, gap, border);
	container.w = container.w_sum;
	container.h = container.h_max;

	loc = border;
	for(var i in items) {
		items[i].x = items[i].x_flow;
		items[i].y = items[i].y_steady;
	}
}

display.stack = function(container, items, border) {
	displayPriv.container_prep(container, items, 0, border);
	container.w = container.w_max;
	container.h = container.h_max;

	for(var i in items) {
		items[i].x = items[i].x_steady;
		items[i].y = items[i].y_steady;
	}
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

displayPriv.container_prep = function(container, items, gap, border) {
	var x_loc, y_loc;
	var widths = new Array();
	var heights = new Array();

	for(i in items) {
		widths.push(items[i].w);
		heights.push(items[i].h);
	}

	container.w_sum = display.sum(widths) + gap * (widths.length - 1) + 2 * border;
	container.w_max = display.max(widths) + 2 * border;
	container.h_sum = display.sum(heights) + gap * (heights.length - 1) + 2 * border;
	container.h_max = display.max(heights) + 2 * border;

	x_loc = border;
	y_loc = border;
	for(var i in items) {
		switch(items[i].align) {
			case 'center':
				items[i].x_steady = (container.w_max - items[i].w) / 2;
				items[i].y_steady = (container.h_max - items[i].h) / 2;
				break;
			case 'push':
				items[i].x_steady = container.w_max - border - items[i].w;
				items[i].y_steady = container.h_max - border - items[i].h;
				break;
			default:
				items[i].x_steady = border;
				items[i].y_steady = border;
		}
		items[i].x_flow = x_loc;
		items[i].y_flow = y_loc;

		x_loc += items[i].w + gap;
		y_loc += items[i].h + gap;

		if(items[i].align != 'spacer') {
			container.addChild(items[i]);
		}
	}

}

