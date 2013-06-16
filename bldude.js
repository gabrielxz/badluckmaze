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
	board.remove_dude(dudeObj);
	dudeObj.row = row;
	dudeObj.col = col;
	board.add_dude(dudeObj);
	dudeObj.canMove = false;
	createjs.Sound.play("movement", createjs.Sound.INTERRUPT_NONE, 0, 1000, 0, 1, 0);
}

dudes.attack = function(dudeObj) {
	dudeObj.canAttack = false;
	dudeObj.canMove = false;
}

dudes.kill = function(dudeObj) {
	dudeObj.health = 0;
	board.remove_dude(dudeObj);
	stage.update();
	createjs.Sound.play("deathScream", createjs.Sound.INTERRUPT_NONE, 0, 0, 0, 0.75, 0);

	// Does this belong here?
	bl.checkForWin();
}

dudes.wound = function(dudeObj, amount) {
	dudeObj.health -= amount;
	if(dudeObj.health <= 0) {
		dudes.kill(dudeObj);
	}
}

dudes.reset_all = function(player)
{
	var dudeObj;
	for(var d in dudesPriv.dudes[player]) {
		dudeObj = dudesPriv.dudes[player][d];
		dudeObj.canMove = true;
		dudeObj.canAttack = true;
	}
}

dudes.init = function() {
	blassets['Archer'] = new Array();
	blassets['Archer'][RED_PLAYER] = new createjs.Bitmap('assets/archerfront.png');
	blassets['Archer'][BLUE_PLAYER] = new createjs.Bitmap('assets/archerback.png');
	blassets['Archer']['Portrait'] = new createjs.Bitmap('assets/archerbig.png');
	blassets['Rogue'] = new Array();
	blassets['Rogue'][RED_PLAYER] = new createjs.Bitmap('assets/warriorfront.png');
	blassets['Rogue'][BLUE_PLAYER] = new createjs.Bitmap('assets/warriorback.png');
	blassets['Rogue']['Portrait'] = new createjs.Bitmap('assets/warriorbig.png');
	blassets['Warrior'] = new Array();
	blassets['Warrior'][RED_PLAYER] = new createjs.Bitmap('assets/knightfront.png');
	blassets['Warrior'][BLUE_PLAYER] = new createjs.Bitmap('assets/knightback.png');
	blassets['Warrior']['Portrait'] = new createjs.Bitmap('assets/knightbig.png');

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

	// Change when player choice is added
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
	this.image     = blassets[type][owner].clone();
	this.bigImage  = blassets[type]['Portrait'].clone();
	board.add_dude(this);
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 
