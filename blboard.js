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

board.add_dude = function(dude) {
	var square = boardPriv.grid[dude.row][dude.col];
	dude.image.x = 0 - Math.floor(dude.image.image.width / 2);
	dude.image.y = 0 - dude.image.image.height;
	boardPriv.add_item(dude, 'dude', square);
	square.dude = dude;
}

board.remove_dude = function(dude) {
	var square = boardPriv.grid[dude.row][dude.col];
	boardPriv.remove_item('dude', square);
	square.dude = null;
}

board.add_totem = function(totem) {
	var square = boardPriv.grid[totem.row][totem.col];
	totem.image.x = 0 - Math.floor(totem.image.image.width/2);
	totem.image.y = 10 - totem.image.image.height;
	// FIXME: Change the png files so this is unnecessary
	if(totem.type == 'Pit') {
		totem.image.y += 15;
	}
	boardPriv.add_item(totem, 'totem', square);
	square.totem = totem;
}

board.remove_totem = function(totem) {
	var square = boardPriv.grid[totem.row][totem.col];
	boardPriv.remove_item('totem', square);
	square.totem = null;
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

board.init = function() {
	blassets['Board'] = new createjs.Bitmap('assets/board.png');

	stage.addChild(blassets['Board']);

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

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC ACCESSORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

board.get_dude = function(row, col) {
	var square = boardPriv.grid[row][col];
	return square.dude;
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
	this.dude  = null;
	this.totem = null;
	this.base  = new createjs.Container();

	this.base.hitArea = boardPriv.click;
	this.base.addChild(boardPriv.newTile('red',   'FF0000'));
	this.base.addChild(boardPriv.newTile('green', '00FF00'));
	this.base.addChild(boardPriv.newSlot('totem'));
	this.base.addChild(boardPriv.newSlot('dude'));

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

boardPriv.add_item = function(item, type, square) {
	var slot = square.base.getChildByName(type);
	if(slot.getNumChildren() > 0) {
		console.log("Error: Add item - occupied", square, item);
		return;
	}
	slot.addChild(item.image);
}

boardPriv.remove_item = function(type, square) {
	var slot = square.base.getChildByName(type);
	slot.removeAllChildren();
}

boardPriv.onClick = function(click) {
	var square = click.target.square;
	var red = square.base.getChildByName('red').on;
	var green = square.base.getChildByName('green').on;
	bl.select(square.row, square.col, square.dude, red, green);
}

