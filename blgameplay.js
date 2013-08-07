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

	gamePriv.display_dude = dude;

	if(!select_dude && board.get_highlight(prev_row, prev_col, SQUARE_SELECT)) {
		if(board.get_highlight(row, col, SQUARE_MOVE)) {
			dudes.move(prev_dude, row, col);
		} else if (board.get_highlight(row, col, SQUARE_ATTACK)) {
			fight.begin(prev_dude, dude);
			gamePriv.display_dude = null;
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

	gamePriv.update_dice_display();
	gamePriv.update_dude_display();
	stage.update();
}

gamePriv.update_dude_display = function() {
	var dude = gamePriv.display_dude;
	if(!dude) {
		gamePriv.hooks.dude_display.visible = false;
		return;
	}

	gamePriv.hooks.title.text = dude.title;
	gamePriv.hooks.portrait.removeAllChildren();
	gamePriv.hooks.portrait.addChild(dude.portrait);
	gamePriv.hooks.speed.text = dude.speed;
	gamePriv.hooks.range.text = dude.range;
	gamePriv.hooks.power.text = dude.power;
	gamePriv.hooks.health.text = dude.health;

	gamePriv.hooks.dude_display.visible = true;
}

gamePriv.update_dice_display = function() {
	var container;
	for(var p = 0; p < NUM_PLAYERS; p++) {
		for(var d = 0; d < NUM_DICE_PER_PLAYER; d++) {
			for(var s = 0; s < NUM_SIDES_PER_DIE; s++) {
				container = gamePriv.hooks.dice[p][d][s];
				container.removeAllChildren();
				container.addChild(dice.get_side_img(p, d, s));
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

gamePriv.createDisplayHooks = function() {
	this.dice = new Array();
	this.dude_display = null;
	this.portrait = null;
	this.speed = null;
	this.range = null;
	this.power = null;
	this.health = null;
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE DISPLAY TREE -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

gamePriv.newDieDisplay = function(player, die) {
	var container = new createjs.Container();
	var item, items = new Array();
	container.name = 'Die';

	for(var s = 0; s < NUM_SIDES_PER_DIE; s++) {
		item = new createjs.Container();
		item.name = 'Side ' + s;
		item.w = 65;
		item.h = 65;
		item.scaleX = 0.5;
		item.scaleY = 0.5;
		items.push(item);
		gamePriv.hooks.dice[player][die][s] = item;
	}

	display.horizontal(container, items, 10, 0);

	return container;
}

gamePriv.newDiceDisplay = function(player) {
	var container = new createjs.Container();
	var item, items = new Array();
	container.name = 'Dice';

	gamePriv.hooks.dice[player] = new Array();
	for(var d = 0; d < NUM_DICE_PER_PLAYER; d++) {
		gamePriv.hooks.dice[player][d] = new Array();
		item = gamePriv.newDieDisplay(player, d);
		items.push(item);
	}

	display.vertical(container, items, 20, 0);

	return container;
}

gamePriv.newDudeStatsLabels = function() {
	var item, items = new Array();
	var column, columns = new Array();
	var container = new createjs.Container();
	container.name = 'Stats';

	item = display.newText('SPEED:', 20);
	items.push(item);

	item = display.newText('RANGE:', 20);
	items.push(item);

	item = display.newText('POWER:', 20);
	items.push(item);

	item = display.newText('HEALTH:', 20);
	items.push(item);

	display.vertical(container, items, 10, 0);

	return container;
}

gamePriv.newDudeStats = function() {
	var item, items = new Array();
	var column, columns = new Array();
	var container = new createjs.Container();
	container.name = 'Stats';

	item = display.newText('##', 20);
	items.push(item);
	gamePriv.hooks.speed = item;

	item = display.newText('##', 20);
	items.push(item);
	gamePriv.hooks.range = item;

	item = display.newText('##', 20);
	items.push(item);
	gamePriv.hooks.power = item;

	item = display.newText('##', 20);
	items.push(item);
	gamePriv.hooks.health = item;

	display.vertical(container, items, 10, 0);

	return container;
}

gamePriv.newDudeInfoDisplay = function() {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Dude Info Display';

	item = new createjs.Container();
	item.name = 'Portrait';
	item.h_align = 'center';
	item.w = 150;
	item.h = 200;
	item.scaleX = 0.5;
	item.scaleY = 0.5;
	items.push(item);
	gamePriv.hooks.portrait = item;

	item = gamePriv.newDudeStatsLabels();
	item.v_align = 'center';
	items.push(item);

	item = gamePriv.newDudeStats();
	item.v_align = 'center';
	items.push(item);

	display.horizontal(container, items, 10, 0);

	return container;
}

gamePriv.newDudeDisplay = function() {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Dude Display';

	item = display.newText('== TITLE ==', 30);
	item.h_align = 'center';
	items.push(item);
	gamePriv.hooks.title = item;

	item = gamePriv.newDudeInfoDisplay();
	items.push(item);

	display.vertical(container, items, 10, 10);

	// Background
	item = new createjs.Shape();
	item.graphics.f('888888').rr(0, 0, container.w, container.h, 12);
	item.alpha = 0.5
	container.addChildAt(item, 0);

	return container;
}

gamePriv.newButton = function() {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'End Turn';

	item = display.newText('End Turn', 40);
	item.h_align = 'center';
	item.v_align = 'center';
	items.push(item);

	display.stack(container, items, 10);

	// Background
	item = new createjs.Shape();
	item.graphics.f('800000').rr(0, 0, container.w, container.h, 12);
	container.addChildAt(item, 0);
	container.hitArea = item;
	container.addEventListener('click', game.end_turn);

	return container;
}

gamePriv.newOverlay = function() {
	var item, items = new Array();
	var container = new createjs.Container();
	container.name = 'Game Overlay';

	// Dude info
	item = gamePriv.newDudeDisplay();
	item.v_align = 'top';
	item.h_align = 'left';
	item.visible = false;
	items.push(item);
	gamePriv.hooks.dude_display = item;

	// Red player dice
	item = gamePriv.newDiceDisplay(RED_PLAYER);
	item.v_align = 'top';
	item.h_align = 'right';
	items.push(item);

	// Blue player dice
	item = gamePriv.newDiceDisplay(BLUE_PLAYER);
	item.v_align = 'bottom';
	item.h_align = 'left';
	items.push(item);

	// End turn button
	item = gamePriv.newButton();
	item.v_align = 'bottom';
	item.h_align = 'right';
	items.push(item);

	display.fill(stage, container);
	display.place(container, items, 20);

	return container;
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

	gamePriv.hooks = new gamePriv.createDisplayHooks();
	gamePriv.overlay = gamePriv.newOverlay();
	stage.addChild(gamePriv.overlay);

	gamePriv.curr_player = RED_PLAYER;
	gamePriv.start_turn();
}

