BOARD_ROWS    = 13;
BOARD_COLS    = 13;
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
	boardPriv.colored_squares[color] = squares;
	boardPriv.highlight(color, 0.25, squares);
}

board.clear = function() {
	for(var color in boardPriv.colored_squares) {
		squares = boardPriv.colored_squares[color];
		boardPriv.highlight(color, 0, squares);
	}
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC ACCESSORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

board.get_item = function(row, col, type) {
	var square = boardPriv.grid[row][col];
	return square.base.getChildByName(type).item;
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
	slot.alpha = 1;
	slot.x = SQUARE_WIDTH/2+1;
	slot.y = Math.floor(SQUARE_HEIGHT * 0.75);

	return slot;
}

boardPriv.newTile = function(name, color) {
	tile = new createjs.Shape();

	tile.name = name;
	tile.graphics.beginFill(color).moveTo(SQUARE_WIDTH/2+1, 0);
	tile.graphics.lineTo(SQUARE_WIDTH+1, SQUARE_HEIGHT/2+1);
	tile.graphics.lineTo(SQUARE_WIDTH/2+1, SQUARE_HEIGHT+1);
	tile.graphics.lineTo(0, SQUARE_HEIGHT/2+1);
	tile.graphics.lineTo(SQUARE_WIDTH/2+1, 0).endStroke();
	tile.alpha = 0;
	tile.on = false;
	tile.x = 0;
	tile.y = 0;
	tile.cache(0, 0, SQUARE_WIDTH+1, SQUARE_HEIGHT+1);

	return tile;
}

boardPriv.createSquare = function(row, col) {
	this.row   = row;
	this.col   = col;
	this.base  = new createjs.Container();

	this.base.hitArea = boardPriv.click;
	this.base.addChild(boardPriv.newTile('red',   'FF0000'));
	this.base.addChild(boardPriv.newTile('green', '00FF00'));
	this.base.addChild(boardPriv.newSlot('Totem'));
	this.base.addChild(boardPriv.newSlot('Dude'));

	this.base.x = H_OFFSET + (SQUARE_WIDTH/2+1) * col - (SQUARE_WIDTH/2+1) * (row + 1);
	this.base.y = V_OFFSET + (SQUARE_HEIGHT/2+1) * col + (SQUARE_HEIGHT/2+1) * row;
	this.base.name = 'grid' + row + 'x' + col;
	this.base.square = this;
	this.base.addEventListener('click', boardPriv.onClick);
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

boardPriv.highlight = function(color, alpha, squares) {
	var square, tile;
	for(i in squares) {
		square = squares[i];
		tile = square.base.getChildByName(color);
		tile.alpha = alpha;
		tile.on = (alpha != 0);
	}
}

boardPriv.onClick = function(click) {
	var square = click.target.square;
	var dude = square.base.getChildByName('Dude').item;
	var red = square.base.getChildByName('red').on;
	var green = square.base.getChildByName('green').on;
	bl.select(square.row, square.col, dude, red, green);
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

board.init = function() {
	stage.addChild(media.get_background_img());

	boardPriv.click = boardPriv.newTile('click', '000000');
	boardPriv.click.alpha = 1;

	boardPriv.grid = new Array();
	for(var r = 0; r < BOARD_ROWS; r++) {
		boardPriv.grid[r] = new Array();
		for(var c = 0; c < BOARD_COLS; c++) {
			boardPriv.grid[r][c] = new boardPriv.createSquare(r, c);
			stage.addChild(boardPriv.grid[r][c].base);
		}
	}

	boardPriv.colored_squares = new Array();
	boardPriv.colored_squares['red'] = null;
	boardPriv.colored_squares['green'] = null;
}

