SQUARE_WIDTH  = 109;
SQUARE_HEIGHT = 64;
V_OFFSET      = 110;
H_OFFSET      = 960;

board = new Object();
boardPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

board.add_item = function(type, item) {
	var square = boardPriv.grid[item.row][item.col];
	var slot = square.base.getChildByName(type);
	if(slot.getNumChildren() > 0) {
		console.log("Error: Add item - occupied", square, item);
		return;
	}
	slot.addChild(item.image);
	slot.item = item;
}

board.remove_item = function(type, item) {
	var square = boardPriv.grid[item.row][item.col];
	var slot = square.base.getChildByName(type);
	slot.removeAllChildren();
	slot.item = null;
}

board.highlight = function(color, squares) {
	boardPriv.highlight([color], squares, true);
}

board.clear = function() {
	boardPriv.highlight(boardPriv.colors, boardPriv.all_squares, false);
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC ACCESSORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

board.get_item = function(row, col, type) {
	var square = boardPriv.grid[row][col];
	return square.base.getChildByName(type).item;
}

board.get_highlight = function(row, col, color) {
	var square = boardPriv.grid[row][col];
	return square.base.getChildByName(color).visible;
}

board.get_square = function(row, col) {
	return boardPriv.grid[row][col];
}

board.get_squares = function(row, col, radius, filter) {
	var square, squares = new Array();

	rMin = Math.max(row - radius, 0);
	rMax = Math.min(row + radius, BOARD_ROWS-1);
	cMin = Math.max(col - radius, 0);
	cMax = Math.min(col + radius, BOARD_COLS-1);

	for (r = rMin; r <= rMax; r++) {
		rowDelta = Math.abs(r - row);
		for (c = cMin; c <= cMax; c++) {
			colDelta = Math.abs(c - col);
			square = boardPriv.grid[r][c];
			if (rowDelta + colDelta <= radius && filter(r, c)) {
				squares.push(square);
			}
		}
	}

	return squares;
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

boardPriv.newSlot = function(name) {
	var slot = new createjs.Container();

	slot.name = name;
	slot.x = SQUARE_WIDTH/2+1;
	slot.y = Math.floor(SQUARE_HEIGHT * 0.75);

	return slot;
}

boardPriv.newTile = function(color) {
	tile = new createjs.Shape();

	tile.name = color;
	tile.graphics.beginFill(color).moveTo(SQUARE_WIDTH/2+1, 0);
	tile.graphics.lineTo(SQUARE_WIDTH+1, SQUARE_HEIGHT/2+1);
	tile.graphics.lineTo(SQUARE_WIDTH/2+1, SQUARE_HEIGHT+1);
	tile.graphics.lineTo(0, SQUARE_HEIGHT/2+1);
	tile.graphics.lineTo(SQUARE_WIDTH/2+1, 0).endStroke();
	tile.alpha = 0.25;
	tile.visible = false;
	tile.x = 0;
	tile.y = 0;
	tile.cache(0, 0, SQUARE_WIDTH+1, SQUARE_HEIGHT+1);

	return tile;
}

boardPriv.createSquare = function(row, col, items, colors) {
	this.row   = row;
	this.col   = col;
	this.base  = new createjs.Container();

	for (var i in colors) {
		this.base.addChild(boardPriv.newTile(colors[i]));
	}

	for (var i in items) {
		this.base.addChild(boardPriv.newSlot(items[i]));
	}

	this.base.x = H_OFFSET + (SQUARE_WIDTH/2+1) * col - (SQUARE_WIDTH/2+1) * (row + 1);
	this.base.y = V_OFFSET + (SQUARE_HEIGHT/2+1) * col + (SQUARE_HEIGHT/2+1) * row;
	this.base.name = 'grid' + row + 'x' + col;
	this.base.square = this;
	this.base.hitArea = boardPriv.click;
	this.base.addEventListener('click', boardPriv.onClick);
}

boardPriv.newBoard = function(items, colors) {
	var square, container = new createjs.Container();
	container.name = 'Board';

	container.addChild(media.get_background_img());

	for (var i in boardPriv.all_squares) {
		square = boardPriv.all_squares[i];
		container.addChild(square.base);
	}

	return container;
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

boardPriv.highlight = function(colors, squares, visible) {
	var square, color, tile;
	for(var s in squares) {
		square = squares[s];
		for(var c in colors) {
			color = colors[c];
			tile = square.base.getChildByName(color);
			tile.visible = visible;
		}
	}
}

boardPriv.onClick = function(click) {
	var square = click.target.square;
	var prev_square = boardPriv.selected;
	if(prev_square == null) {
		prev_square = square;
	}
	
	game.select(square.row, square.col, prev_square.row, prev_square.col);
	boardPriv.selected = square;
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

board.init = function(items, colors) {
	var square;

	boardPriv.click = boardPriv.newTile('black');
	boardPriv.items = items;
	boardPriv.colors = colors;
	boardPriv.selected = null;
	boardPriv.all_squares = new Array();

	boardPriv.grid = new Array();
	for(var r = 0; r < BOARD_ROWS; r++) {
		boardPriv.grid[r] = new Array();
		for(var c = 0; c < BOARD_COLS; c++) {
			square = new boardPriv.createSquare(r, c, items, colors);
			boardPriv.grid[r][c] = square;
			boardPriv.all_squares.push(square);
		}
	}

	boardPriv.display = boardPriv.newBoard();
	stage.addChild(boardPriv.display);
}

