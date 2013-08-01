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
	displayPriv.container_prep(container, items, gap, border, 'max', 'sum');
	displayPriv.align_items(container, items, gap, border, 'steady', 'flow');
}

display.horizontal = function(container, items, gap, border) {
	displayPriv.container_prep(container, items, gap, border, 'sum', 'max');
	displayPriv.align_items(container, items, gap, border, 'flow', 'steady');
}

display.stack = function(container, items, border) {
	displayPriv.container_prep(container, items, 0, border, 'max', 'max');
	displayPriv.align_items(container, items, 0, border, 'steady', 'steady');
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

displayPriv.container_prep = function(container, items, gap, border, w_align, h_align) {
	var widths = new Array();
	var heights = new Array();

	for(i in items) {
		widths.push(items[i].w);
		heights.push(items[i].h);
	}

	if(w_align == 'sum') {
		container.w = display.sum(widths) + gap * (widths.length - 1) + 2 * border;
	} else if(w_align == 'max') {
		container.w = display.max(widths) + 2 * border;
	}

	if(h_align == 'sum') {
		container.h = display.sum(heights) + gap * (heights.length - 1) + 2 * border;
	} else if(h_align == 'max') {
		container.h = display.max(heights) + 2 * border;
	}
}

displayPriv.align_items = function(container, items, gap, border, x_align, y_align) {
	var x_flow = border;
	var y_flow = border;
	var x_steady, y_steady;
	for(var i in items) {
		switch(items[i].align) {
			case 'center':
				x_steady = (container.w - items[i].w) / 2;
				y_steady = (container.h - items[i].h) / 2;
				break;
			case 'push':
				x_steady = container.w - border - items[i].w;
				y_steady = container.h - border - items[i].h;
				break;
			default:
				x_steady = border;
				y_steady = border;
		}

		if(x_align == 'steady') {
			items[i].x = x_steady;
		} else if(x_align == 'flow') {
			items[i].x = x_flow;
			x_flow += items[i].w + gap;
		}

		if(y_align == 'steady') {
			items[i].y = y_steady;
		} else if(y_align == 'flow') {
			items[i].y = y_flow;
			y_flow += items[i].h + gap;
		}

		if(items[i].align != 'spacer') {
			container.addChild(items[i]);
		}
	}
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

display.init = function() {
	var scaleW, scaleH, scale;
	stage = new createjs.Stage("myCanvas");

	scaleW = window.innerWidth / stage.canvas.width;
	scaleH = window.innerHeight / stage.canvas.height;
	scale = Math.min(scaleW, scaleH);
	stage.scaleX = scale;
	stage.scaleY = scale;
}

