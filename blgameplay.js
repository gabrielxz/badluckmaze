NUM_PLAYERS         = 2;
RED_PLAYER          = 0;
BLUE_PLAYER         = 1;
NO_PLAYER           = 99;
BOARD_ROWS          = 13;
BOARD_COLS          = 13;
NUM_DICE_PER_PLAYER = 2;
NUM_SIDES_PER_DIE   = 6;
SQUARE_MOVE         = 'white';
SQUARE_ATTACK       = 'red';
SQUARE_SELECT       = 'green';

game = new Object();
gamePriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

game.select = function(row, col, prev_row, prev_col) {
	var dude = board.get_item(row, col, 'Dude');
	var prev_dude = board.get_item(prev_row, prev_col, 'Dude');
	var select_dude = board.get_highlight(row, col, SQUARE_SELECT);

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
	gamePriv.update();
}

game.fight_end = function(attacker, defender, damage) {
	dudes.attack(attacker, defender, damage);
	board.clear();
	gamePriv.update();
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
	totems.check();
	gamePriv.update();
}
 
gamePriv.update = function() {
	var squares;

	if(dudes.num_alive(game.other_player()) <= 0) {
		// TODO: Win condition
	}

	squares = dudes.valid_selections(gamePriv.curr_player);
	board.highlight(SQUARE_SELECT, squares);

	if(squares.length == 0) {
		// TODO: Turn complete
	}

	stage.update();
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

game.init = function() {
	var board_items = ['Totem', 'Dude'];
	var board_colors = [SQUARE_MOVE, SQUARE_ATTACK, SQUARE_SELECT];

	display.init();
	media.init();
	board.init(board_items, board_colors);
	dudes.init();
	totems.init();
	dice.init();
	fight.init();

	gamePriv.curr_player = RED_PLAYER;
	gamePriv.start_turn();
}

