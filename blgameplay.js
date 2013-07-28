RED_PLAYER  = 0;
BLUE_PLAYER = 1;
SQUARE_MOVE   = 'white';
SQUARE_ATTACK = 'red';
SQUARE_SELECT = 'green';

game = new Object();
gamePriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

game.select = function(row, col, prev_row, prev_col) {
	var dude = board.get_item(row, col, 'Dude');
	var prev_dude = board.get_item(prev_row, prev_col, 'Dude');
	var select_dude = board.get_highlight(row, col, SQUARE_SELECT);
	var valid_selections;

	if(!select_dude && board.get_highlight(prev_row, prev_col, SQUARE_SELECT)) {
		if(board.get_highlight(row, col, SQUARE_MOVE)) {
			dudes.move(prev_dude, row, col);
		} else if (board.get_highlight(row, col, SQUARE_ATTACK)) {
			fight.begin(prev_dude, dude);
		}
	}

	board.clear();

	if(select_dude) {
		board.highlight(SQUARE_MOVE, dudes.valid_moves(dude));
		board.highlight(SQUARE_ATTACK, dudes.valid_attacks(dude));
	}

	valid_selections = dudes.valid_selections(gamePriv.curr_player);
	// if length is 0, turn is over
	board.highlight(SQUARE_SELECT, valid_selections );
	stage.update();
}

game.check_for_win = function() {
	if (dudes.num_alive(game.other_player()) <= 0) {
		// Win condition
	}
}

game.end_turn = function() {
	gamePriv.curr_player = game.other_player();
	gamePriv.start_turn();
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC ACCESSORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

game.is_dude_active = function(dude) {
	return (dude && dude.owner == gamePriv.curr_player);
}

game.is_dude_inactive = function(dude) {
	return (dude && dude.owner != gamePriv.curr_player);
}

game.other_player = function() {
	return (gamePriv.curr_player == RED_PLAYER ? BLUE_PLAYER : RED_PLAYER);
}

game.is_valid_move = function(row, col) {
	return (board.get_item(row, col, 'Dude') == null);
}

game.is_valid_attack = function(row, col) {
	var dude = board.get_item(row, col, 'Dude');
	return (game.is_dude_inactive(dude));
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

gamePriv.start_turn = function() {
	board.clear();
	dudes.reset_all(gamePriv.curr_player);
	board.highlight(SQUARE_SELECT, dudes.valid_selections(gamePriv.curr_player));
	totems.check();
	stage.update();
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

game.init = function() {
	var scaleW, scaleH, scale;
	var board_items = ['Totem', 'Dude'];
	stage = new createjs.Stage("myCanvas");

	media.init();
	board.init(board_items);
	dudes.init();
	totems.init();
	dice.init();
	fight.init();

	scaleW = window.innerWidth / stage.canvas.width;
	scaleH = window.innerHeight / stage.canvas.height;
	scale = Math.min(scaleW, scaleH);
	stage.scaleX = scale;
	stage.scaleY = scale;

	gamePriv.curr_player = RED_PLAYER;
	gamePriv.start_turn();
}

