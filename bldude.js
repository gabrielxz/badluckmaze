BOARD_ROWS  = 13;
BOARD_COLS  = 13;
NUM_PLAYERS = 2;
RED_PLAYER  = 0;
BLUE_PLAYER = 1;

dudes = new Object();
dudesPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

dudes.move = function(dudeObj, row, col) {
	board.remove_item('Dude', dudeObj);
	dudeObj.row = row;
	dudeObj.col = col;
	board.add_item('Dude', dudeObj);
	dudeObj.canMove = false;
	media.play_sound("movement", 1000, 1);
}

dudes.attack = function(dudeObj) {
	dudeObj.canAttack = false;
	dudeObj.canMove = false;
}

dudes.kill = function(dudeObj) {
	dudeObj.health = 0;
	dudeObj.speed = 0;
	dudeObj.range = 0;
	dudeObj.power = 0;
	dudeObj.canMove = false;
	dudeObj.canAttack = false;
	board.remove_item('Dude', dudeObj);
	stage.update();
	media.play_sound("deathScream", 0, 0.75);

	// TODO: Nice to have a dead portrait for fight screen

	// Does this belong here?
	bl.checkForWin();
}

dudes.wound = function(dudeObj, amount) {
	dudeObj.health -= amount;
	if(dudeObj.health <= 0) {
		dudes.kill(dudeObj);
	}
}

dudes.reset_all = function(player) {
	var dudeObj;
	for(var d in dudesPriv.dudes[player]) {
		dudeObj = dudesPriv.dudes[player][d];
		dudeObj.canMove = true;
		dudeObj.canAttack = true;
	}
}


//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC ACCESSORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

dudes.num_alive = function(player) {
	var dudeObj, count = 0;
	for(var d in dudesPriv.dudes[player]) {
		dudeObj = dudesPriv.dudes[player][d];
		if(dudeObj.health > 0) {
			count++;
		}
	}
	return count;
}

dudes.num_available = function(player) {
	var dudeObj, count = 0;
	for(var d in dudesPriv.dudes[player]) {
		dudeObj = dudesPriv.dudes[player][d];
		if(dudeObj.canMove || dudeObj.canAttack) {
			count++;
		}
	}
	return count;
}

dudes.valid_moves = function(dudeObj) {
	if(!dudeObj.canMove) {
		return new Array();
	}

	var filter = function(row, col){return(bl.isValidMove(row, col));}

	var squares = board.get_squares(dudeObj.row, dudeObj.col, dudeObj.speed, filter);
	if(squares.length <= 0) {
		dudeObj.canMove = false;
	}
	return squares;
}

dudes.valid_attacks = function(dudeObj) {
	if(!dudeObj.canAttack) {
		return new Array();
	}

	var filter = function(row, col){return(bl.isValidAttack(row, col));}

	var squares = board.get_squares(dudeObj.row, dudeObj.col, dudeObj.range, filter);
	if(squares.length <= 0 && !dudeObj.canMove) {
		dudeObj.canAttack = false;
	}
	return squares;
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

dudesPriv.createDude = function(owner, row, col, type) {
	this.owner     = owner;
	this.row       = row;
	this.col       = col;
	this.type      = type;
	this.canAttack = true;
	this.canMove   = true;
	this.speed     = dudesPriv.speed[type];
	this.range     = dudesPriv.range[type];
	this.power     = dudesPriv.power[type];
	this.health    = dudesPriv.health[type];
	this.image     = media.get_dude_img(type, owner);
	this.portrait  = media.get_portrait_img(type);
	board.add_item('Dude', this);
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

dudes.init = function() {
	dudesPriv.speed = new Array();
	dudesPriv.speed['Archer'] =   2;
	dudesPriv.speed['Rogue'] =    2;
	dudesPriv.speed['Warrior'] =  1;
	dudesPriv.range = new Array();
	dudesPriv.range['Archer'] =   3;
	dudesPriv.range['Rogue'] =    1;
	dudesPriv.range['Warrior'] =  1;
	dudesPriv.power = new Array();
	dudesPriv.power['Archer'] =   4;
	dudesPriv.power['Rogue'] =    8;
	dudesPriv.power['Warrior'] =  4;
	dudesPriv.health = new Array();
	dudesPriv.health['Archer'] =  8;
	dudesPriv.health['Rogue'] =   16;
	dudesPriv.health['Warrior'] = 32;

	dudesPriv.dudes = new Array();
	dudesPriv.dudes[RED_PLAYER] = new Array();
	dudesPriv.dudes[BLUE_PLAYER] = new Array();

	// TODO: Change when player choice is added
	dudesPriv.dudes[RED_PLAYER].push(new dudesPriv.createDude(RED_PLAYER, 0, 1,  'Archer'));
	dudesPriv.dudes[RED_PLAYER].push(new dudesPriv.createDude(RED_PLAYER, 0, 5,  'Rogue'));
	dudesPriv.dudes[RED_PLAYER].push(new dudesPriv.createDude(RED_PLAYER, 0, 6,  'Warrior'));
	dudesPriv.dudes[RED_PLAYER].push(new dudesPriv.createDude(RED_PLAYER, 0, 7,  'Rogue'));
	dudesPriv.dudes[RED_PLAYER].push(new dudesPriv.createDude(RED_PLAYER, 0, 11, 'Archer'));

	dudesPriv.dudes[BLUE_PLAYER].push(new dudesPriv.createDude(BLUE_PLAYER, 12, 1,  'Archer'));
	dudesPriv.dudes[BLUE_PLAYER].push(new dudesPriv.createDude(BLUE_PLAYER, 12, 5,  'Rogue'));
	dudesPriv.dudes[BLUE_PLAYER].push(new dudesPriv.createDude(BLUE_PLAYER, 12, 6,  'Warrior'));
	dudesPriv.dudes[BLUE_PLAYER].push(new dudesPriv.createDude(BLUE_PLAYER, 12, 7,  'Rogue'));
	dudesPriv.dudes[BLUE_PLAYER].push(new dudesPriv.createDude(BLUE_PLAYER, 12, 11, 'Archer'));

	// FOR TESTING ONLY
	dudesPriv.dudes[RED_PLAYER].push(new dudesPriv.createDude(RED_PLAYER, 4, 5,  'Archer'));
	dudesPriv.dudes[RED_PLAYER].push(new dudesPriv.createDude(RED_PLAYER, 5, 5,  'Warrior'));
	dudesPriv.dudes[BLUE_PLAYER].push(new dudesPriv.createDude(BLUE_PLAYER, 6, 5,  'Rogue'));
}

