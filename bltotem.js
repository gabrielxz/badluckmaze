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
		if (game.is_dude_active(dude)) {
			totemsPriv.take(totemObj, dude);
		}
	}
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

totemsPriv.good_luck = function(player, amount) {
	for(var i = 0; i < amount; i++) {
		dice.gain_pip(player);
	}
}

totemsPriv.bad_luck = function(player, amount) {
	for(var i = 0; i < amount; i++) {
		dice.lose_pip(player);
	}
}

totemsPriv.take = function(totemObj, dude) {
	var prev_owner = totemObj.owner;
	var new_owner = dude.owner;

	// Pit sacrifice
	if(totemObj.type == "Pit") {
		dudes.kill(dude);
	}

	if(prev_owner == new_owner) {
		return;
	}

	if(prev_owner != NO_PLAYER) {
		// Undo previous bad luck given to new owner
		totemsPriv.good_luck(new_owner, totemObj.badLuck);

		// Undo previous good luck given to previous owner
		totemsPriv.bad_luck(prev_owner, totemObj.goodLuck);
	}

	// Give bad luck to opponent
	totemsPriv.bad_luck(game.other_player(new_owner), totemObj.badLuck);

	// Give good luck to new owner
	totemsPriv.good_luck(new_owner, totemObj.goodLuck);

	totemObj.image = totemObj.images[new_owner];
	totemObj.owner = new_owner;
	board.remove_item('Totem', totemObj);
	board.add_item('Totem', totemObj);
}

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

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

