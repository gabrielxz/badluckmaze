NUM_PLAYERS = 2;
NUM_DICE_PER_PLAYER = 2;
NUM_SIDES_PER_DIE = 6;

dice = new Object();
dicePriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

dice.lose_pip = function(player) {
	var r, dieObj, sideObj;

	// Handle overflow pips
	if(dicePriv.extra_pips[player] > 0) {
		dicePriv.extra_pips[player]--;
		return;
	}

	do {
		r = dicePriv.rand(NUM_DICE_PER_PLAYER);
		dieObj = dicePriv.dice[player][d];
		r = dicePriv.rand(NUM_SIDES_PER_DIE);
		sideObj = die.sides[s];
	} while(sideObj.base_val - side.missing <= 0)

	sideObj.missing++;
	dicePriv.update_side(sideObj);
	dicePriv.removed[player].push(side);
}

dice.gain_pip = function(player) {
	var sideObj;

	// Handle overflow pips
	if(dicePriv.removed[player].length <= 0) {
		dicePriv.extra_pips[player]++;
	}

	sideObj = dicePriv.removed[player].shift();
	sideObj.missing--;
	dicePriv.update_side(sideObj);
}

dice.roll_die = function(player, die) {
	var r, dieObj, sideObj;

	r = dicePriv.rand(NUM_SIDES_PER_DIE)
	dieObj = dicePriv.dice[player][die];
	sideObj = dieObj.sides[r];

	dieObj.result = sideObj;
}

dice.roll_dice = function(player) {
	for(var d = 0; d < NUM_DICE_PER_PLAYER; d++) {
		dice.roll_die(player, d);
	}
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC ACCESSORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

dice.get_side_img = function(player, die, side) {
	return dicePriv.dice[player][die].sides[side].image_p;
}

dice.get_result_img = function(player, die) {
	return dicePriv.dice[player][die].result.image_r;
}

dice.get_result_val = function(player) {
	var sideObj, sum = 0;

	for(var d = 0; d < NUM_DICE_PER_PLAYER; d++) {
		sideObj = dicePriv.dice[player][d].result;
		sum += sideObj.base_val - sideObj.missing;
	}

	return sum;
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

dicePriv.createSide = function(side) {
	this.base_val = side + 1;
	this.missing = 0;

	// Clone image for each number of missing pips
	// One for player die, one for result die
	this.images_p = new Array();
	this.images_r = new Array();
	for(var m = 0; m <= side; m++) {
		this.images_p.push(blassets['dice_p'][side][m].clone());
		this.images_r.push(blassets['dice_r'][side][m].clone());
	}

	dicePriv.update_side(this);
}

dicePriv.createDie = function() {
	// Create array of sides 0-5
	this.sides = new Array();
	for (var s = 0; s < NUM_SIDES_PER_DIE; s++) {
		this.sides.push(new dicePriv.createSide(s));
	}
	
	// Keep last roll result - Init to 1
	this.result = this.sides[0];
}

dicePriv.createImg = function(base, missing) {
	var name = 'assets/dice/die_';
	if(base - missing <= 0) {
		name += '0';
	} else {
		name += base;
		if(missing > 0) {
			name += '-' + missing;
		}
	}
	name += '.png';
	return new createjs.Bitmap(name)
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

dicePriv.update_side = function(sideObj) {
	sideObj.image_p = sideObj.images_p[sideObj.missing];
	sideObj.image_r = sideObj.images_r[sideObj.missing];
}

dicePriv.rand = function(max) {
	return Math.floor(Math.random() * max);
}

dicePriv.init = function() {
	// Create 2D array of player dice images [side][missing_pips]
	blassets['dice_p'] = new Array();
	for(var s = 0; s < NUM_SIDES_PER_DIE; s++) {
		blassets['dice_p'].push(new Array());
		for(var m = 0; m < NUM_SIDES_PER_DIE; m++) {
			blassets['dice_p'][s].push(dicePriv.createImg(s+1, m));
		}
	}

	// Create 2D array of results images [side][missing_pips]
	// Note: Same as player dice for now - could be different
	blassets['dice_r'] = new Array();
	for(var s = 0; s < NUM_SIDES_PER_DIE; s++) {
		blassets['dice_r'].push(new Array());
		for(var m = 0; m < NUM_SIDES_PER_DIE; m++) {
			blassets['dice_r'][s].push(dicePriv.createImg(s+1, m));
		}
	}

	// Create 2D array of dice objects [player][die]
	dicePriv.dice = new Array();
	for(var p = 0; p < NUM_PLAYERS; p++) {
		dicePriv.dice.push(new Array());
		for(var d = 0; d < NUM_DICE_PER_PLAYER; d++) {
			dicePriv.dice[p].push(new dicePriv.createDie());
		}
	}

	// Create list of removals (die side ptrs) for each player
	dicePriv.removed = new Array();
	for(var p = 0; p < NUM_PLAYERS; p++) {
		dicePriv.removed.push(new Array());
	}

	// Store a counter of overflow pips for each player
	dicePriv.extra_pips = new Array();
	for(var p = 0; p < NUM_PLAYERS; p++) {
		dicePriv.extra_pips.push(0);
	}
}

dicePriv.init();
