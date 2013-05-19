window.blassets['totem_dark'] = new createjs.Bitmap('assets/totemdark.png');
window.blassets['totem_red'] = new createjs.Bitmap('assets/totemred.png');
window.blassets['totem_blue'] = new createjs.Bitmap('assets/totemblue.png');
window.blassets['center_dark'] = new createjs.Bitmap('assets/centerdark.png');
window.blassets['center_red'] = new createjs.Bitmap('assets/centerred.png');
window.blassets['center_blue'] = new createjs.Bitmap('assets/centerblue.png');

function
totem(row, col, bl, gl) {
	this.owner = null;
	this.row   = row;
	this.col   = col;
	this.bl    = bl;
	this.gl    = gl;
	if(row == 6 && col == 6) {
		this.image_dark = window.blassets['center_dark'].clone();
		this.image_red  = window.blassets['center_red'].clone();
		this.image_blue = window.blassets['center_blue'].clone();
	} else {
		this.image_dark = window.blassets['totem_dark'].clone();
		this.image_red  = window.blassets['totem_red'].clone();
		this.image_blue = window.blassets['totem_blue'].clone();
	}
	this.image = this.image_dark;
}

function
totem_init() {
	window.totem = new Array();
	window.totem.push(new totem(4,  2, 2, 0));
	window.totem.push(new totem(8,  2, 2, 0));
	window.totem.push(new totem(11, 5, 4, 0));
	window.totem.push(new totem(1,  7, 4, 0));
	window.totem.push(new totem(4, 10, 2, 0));
	window.totem.push(new totem(4, 10, 2, 0));
	window.totem.push(new totem(6,  6, 4, 4));
}

function
totem_hit(dude, totem) {
	if(dude.owner == totem.owner) {
		return;
	}

	// Return pips
	if(totem.owner != null) {
		for(var i = 0; i < totem.bl; i++) {
			dice_gain_pip(dude.owner);
		}
		for(var i = 0; i < totem.gl; i++) {
			dice_lose_pip(totem.owner);
		}
	}

	// Take pips
	for(var i = 0; i < totem.gl; i++) {
		dice_gain_pip(dude.owner);
	}
	for(var i = 0; i < totem.bl; i++) {
		dice_lose_pip(totem.owner);
	}

	totem.owner = dude.owner;
	if(totem.owner == 0) {
		totem.image = totem.image_red;
	} else {
		totem.image = totem.image_blue;
	}
}

function
totem_check(dude) {
	for (var i = 0; i < 7; i++) {
		if(dude.row == window.totem[i].row &&
		   dude.col == window.totem[i].col) {
			totem_hit(dude, window.totem[i]);
		}
	}
}

