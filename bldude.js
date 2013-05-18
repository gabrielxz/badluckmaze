
function
dude(player, row, col) {
	this.owner  = player;
	this.row    = row;
	this.col    = col;
	this.type   = 999;
	this.speed  = 999;
	this.range  = 999;
	this.power  = 999;
	this.health = 999;
}

function
archer(i) {
	window.dude[i].speed  = 2;
	window.dude[i].range  = 3;
	window.dude[i].power  = 4;
	window.dude[i].health = 8;

	if(window.dude[i].owner == 0) {
		// image front
	} else {
		// image back
	}
	// image bust
}

function
warrior(i) {
	window.dude[i].speed  = 2;
	window.dude[i].range  = 1;
	window.dude[i].power  = 8;
	window.dude[i].health = 16;

	if(window.dude[i].owner == 0) {
		// image front
	} else {
		// image back
	}
	// image bust
}

function
knight(i) {
	window.dude[i].speed  = 1;
	window.dude[i].range  = 1;
	window.dude[i].power  = 4;
	window.dude[i].health = 32;

	if(window.dude[i].owner == 0) {
		// image front
	} else {
		// image back
	}
	// image bust
}

function
dude_init() {
	window.dude = new Array();
	window.dude.images = new Array();
	
	// load all images

	// Player 0
	window.dude[0] = new dude(0, 0, 1);
	window.dude[0] = new dude(0, 0, 5);
	window.dude[0] = new dude(0, 0, 6);
	window.dude[0] = new dude(0, 0, 7);
	window.dude[0] = new dude(0, 0, 11);

	// Player 1
	window.dude[0] = new dude(1, 12, 1);
	window.dude[0] = new dude(1, 12, 5);
	window.dude[0] = new dude(1, 12, 6);
	window.dude[0] = new dude(1, 12, 7);
	window.dude[0] = new dude(1, 12, 11);

	// FIXME remove when we can choose
	window.dude[0].type = 0; // Archer
	window.dude[1].type = 1; // Warrior
	window.dude[2].type = 2; // Knight
	window.dude[3].type = 1; // Warrior
	window.dude[4].type = 0; // Archer
	window.dude[5].type = 0; // Archer
	window.dude[6].type = 1; // Warrior
	window.dude[7].type = 2; // Knight
	window.dude[8].type = 1; // Warrior
	window.dude[9].type = 0; // Archer

	for (dude = 0; dude < 10; dude++) {
		switch(window.dude.type[dude]) {
			case 0: archer(dude); break;
			case 1: warrior(dude); break;
			case 2: knight(dude); break;
		}
	}
}

function
dude_get_handle(row, col) {
	for (var i = 0; i < 10; i++) {
		if (window.dude[i].row == row && window.dude[i].col == col) {
			return i;
		}
	}
}

function
dude_move_radius(handle) {
	var j;
	var radius = new Array();

	for (r = 0; r < 13; r++) {
		rowd = Math.abs(r - window.dude[handle].row);
		for (c = 0; c < 13; c++) {
			cold = Math.abs(c - window.dude[handle].col);
			if (rowd + cold <= window.dude[handle].speed) {
				radius[j] = new Object();
				radius[j].x = r;
				radius[j].y = c;
				j++;
			}
		}
	}
}

function
dude_fight_radius(handle) {
	var j;
	var radius = new Array();

	for (r = 0; r < 13; r++) {
		rowd = Math.abs(r - window.dude[handle].row);
		for (c = 0; c < 13; c++) {
			cold = Math.abs(c - window.dude[handle].col);
			if (rowd + cold <= window.dude[i].range) {
				radius[j] = new Object();
				radius[j].x = r;
				radius[j].y = c;
				j++;
			}
		}
	}
}
