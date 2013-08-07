display = new Object();
displayPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
///////////////////////// -- PUBLIC CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

display.newModalCover = function() {
	var item = new createjs.Shape();
	item.name = 'Modal';
	display.fill(stage, item);
	item.graphics.f('FFFFFF').r(0, 0, item.w, item.h);
	item.alpha = 0.5;

	return item;
}

display.createSpacer = function(width, height) {
	this.w = width;
	this.h = height;
	this.spacer = true;
}


display.newText = function(text, size) {
	var item = new createjs.Text(text, size+'pt sans-serif', 'white');
	item.w = item.getMeasuredWidth();
	item.h = item.getMeasuredHeight();
	return item;
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

display.fill = function(container, item) {
	item.x = 0;
	item.y = 0;
	item.w = container.w;
	item.h = container.h;
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

display.place = function(container, items, border) {
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
		container.w = display.sum(widths) + gap * (widths.length - 1);
	} else if(w_align == 'max') {
		container.w = display.max(widths);
	}

	if(h_align == 'sum') {
		container.h = display.sum(heights) + gap * (heights.length - 1);
	} else if(h_align == 'max') {
		container.h = display.max(heights);
	}

	container.w += 2 * border;
	container.h += 2 * border;
}

displayPriv.align_items = function(container, items, gap, border, x_align, y_align) {
	var x_flow = border;
	var y_flow = border;

	for(var i in items) {
		if(x_align == 'steady') {
			displayPriv.place_horizontal(container, items[i], border);
		} else if(x_align == 'flow') {
			items[i].x = x_flow;
			x_flow += items[i].w + gap;
		}

		if(y_align == 'steady') {
			displayPriv.place_vertical(container, items[i], border);
		} else if(y_align == 'flow') {
			items[i].y = y_flow;
			y_flow += items[i].h + gap;
		}

		if(!items[i].spacer) {
			container.addChild(items[i]);

			// FOR TESTING ONLY
			//var box = new createjs.Shape();
			//box.graphics.s('A0A0A0').r(items[i].x, items[i].y, items[i].w, items[i].h);
			//container.addChildAt(box, 0);
		}
	}
}

displayPriv.place_horizontal = function(container, item, border) {
	switch(item.h_align) {
		case 'center':
			item.x = (container.w - item.w) / 2;
			break;
		case 'right':
			item.x = container.w - border - item.w;
			break;
		default:
			item.x = border;
	}
}

displayPriv.place_vertical = function(container, item, border) {
	switch(item.v_align) {
		case 'center':
			item.y = (container.h - item.h) / 2;
			break;
		case 'bottom':
			item.y = container.h - border - item.h;
			break;
		default:
			item.y = border;
	}
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

display.init = function() {
	var scaleW, scaleH, scale;
	stage = new createjs.Stage("myCanvas");
	stage.w = stage.canvas.width;
	stage.h = stage.canvas.height;

	scaleW = window.innerWidth / stage.w;
	scaleH = window.innerHeight / stage.h;
	scale = Math.min(scaleW, scaleH) * 0.95;
	stage.scaleX = scale;
	stage.scaleY = scale;
}

