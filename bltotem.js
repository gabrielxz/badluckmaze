RED_PLAYER  = 0;
BLUE_PLAYER = 1;
NO_PLAYER   = 99;

totems = new Object();
totemsPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

totems.check = function() {
	var totemObj, dude;

	for(var i in totemsPriv.totems) {
		totemObj = totemsPriv.totems[i];

		dude = board.get_item(totemObj.row, totemObj.col, 'Dude');
		if (bl.isDudeActive(dude)) {
			totemsPriv.take(totemObj, dude);
		}
	}
	stage.update();
}

totems.init = function() {
	totemsPriv.badLuck = new Array();
	totemsPriv.badLuck['Minor'] =  2;
	totemsPriv.badLuck['Major'] =  4;
	totemsPriv.badLuck['Pit'] =    4;
	totemsPriv.goodLuck = new Array();
	totemsPriv.goodLuck['Minor'] = 0;
	totemsPriv.goodLuck['Major'] = 0;
	totemsPriv.goodLuck['Pit'] =   4;

	totemsPriv.totems = new Array();
	totemsPriv.totems.push(new totemsPriv.createTotem(2,  4, 'Minor'));
	totemsPriv.totems.push(new totemsPriv.createTotem(2,  8, 'Minor'));
	totemsPriv.totems.push(new totemsPriv.createTotem(10, 4, 'Minor'));
	totemsPriv.totems.push(new totemsPriv.createTotem(10, 8, 'Minor'));
	totemsPriv.totems.push(new totemsPriv.createTotem(5, 11, 'Major'));
	totemsPriv.totems.push(new totemsPriv.createTotem(7,  1, 'Major'));
	totemsPriv.totems.push(new totemsPriv.createTotem(6,  6, 'Pit'));
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

totemsPriv.createTotem = function(row, col, type) {
	this.owner    = NO_PLAYER;
	this.row      = row;
	this.col      = col;
	this.type     = type;
	this.badLuck  = totemsPriv.badLuck[type];
	this.goodLuck = totemsPriv.goodLuck[type];

	this.images = new Array();
	this.images[RED_PLAYER]  = media.get_totem_img(type, RED_PLAYER);
	this.images[BLUE_PLAYER] = media.get_totem_img(type, BLUE_PLAYER);
	this.images[NO_PLAYER]   = media.get_totem_img(type, NO_PLAYER);

	this.image = this.images[this.owner];
	board.add_item('Totem', this);
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

totemsPriv.take = function(totemObj, dude) {
	var owner = totemObj.owner;
	var newOwner = dude.owner;

	// Pit sacrifice
	if(totemObj.type == "Pit") {
		dudes.kill(dude);
	}

	if(owner == newOwner) {
		return;
	}

	for(var i = 0; i < totemObj.badLuck; i++) {
		// Give bad luck to other player
		dice.lose_pip(bl.otherPlayer(newOwner));

		// Also remove bad luck given by previous owner
		if(owner == bl.otherPlayer(newOwner)) {
			dice.gain_pip(newOwner);
		}
	}

	for(var i = 0; i < totemObj.goodLuck; i++) {
		// Give good luck to owner
		dice.lose_pip(newOwner);

		// Also remove good luck given to previous owner
		if(owner == bl.otherPlayer(newOwner)) {
			dice.gain_pip(newOwner);
		}
	}

	totemObj.image = totemObj.images[newOwner];
	totemObj.owner = newOwner;
	board.remove_item('Totem', totemObj);
	board.add_item('Totem', totemObj);
}


