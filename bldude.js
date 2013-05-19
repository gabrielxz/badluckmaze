window.blassets['archer_front']  = new createjs.Bitmap('assets/archerfront.png');
window.blassets['archer_back']   = new createjs.Bitmap('assets/archerback.png');
window.blassets['archer_big']    = new createjs.Bitmap('assets/archerbig.png');
window.blassets['knight_front']  = new createjs.Bitmap('assets/knightfront.png');
window.blassets['knight_back']   = new createjs.Bitmap('assets/knightback.png');
window.blassets['knight_big']    = new createjs.Bitmap('assets/knightbig.png');
window.blassets['warrior_front'] = new createjs.Bitmap('assets/warriorfront.png');
window.blassets['warrior_back']  = new createjs.Bitmap('assets/warriorback.png');
window.blassets['warrior_big']   = new createjs.Bitmap('assets/warriorbig.png');

bl.dude_init = function()
{
	// Player 0
	window.dude.push( bl.archer(0, 0, 1));
	window.dude.push(bl.warrior(0, 0, 5));
	window.dude.push( bl.knight(0, 5, 6));
	window.dude.push(bl.warrior(0, 0, 7));
	window.dude.push( bl.archer(0, 0, 11));

	// Player 1
	window.dude.push( bl.archer(1, 12, 1));
	window.dude.push(bl.warrior(1, 12, 5));
	window.dude.push( bl.knight(1, 6, 6));
	window.dude.push(bl.warrior(1, 12, 7));
	window.dude.push( bl.archer(1, 12, 11));
}

bl.dude = function(player, row, col) {
	this.owner    = player;
	this.row      = row;
	this.col      = col;
	this.type     = 'none';
	this.speed    = 999;
	this.range    = 999;
	this.power    = 999;
	this.health   = 999;
	this.image    = null;
	this.bigImage = null;
	this.canAttack = true;
	this.canMove = true;
}

bl.archer = function(player, row, col) {
	var ret = new bl.dude(player, row, col);
	ret.speed  = 2;
	ret.range  = 3;
	ret.power  = 4;
	ret.health = 8;
	ret.type = 'archer';

	if(ret.owner == 0) {
		ret.image = window.blassets['archer_front'].clone();
	} else {
		ret.image = window.blassets['archer_back'].clone();
	}
	ret.bigImage = window.blassets['archer_big'].clone();
	ret.image.dude = ret;
	
	return ret;
}

bl.warrior = function(player, row, col) {
	var ret = new bl.dude(player, row, col);
	ret.speed  = 2;
	ret.range  = 1;
	ret.power  = 8;
	ret.health = 16;
	ret.type = 'warrior';

	if(ret.owner == 0) {
		ret.image = window.blassets['warrior_front'].clone();
	} else {
		ret.image = window.blassets['warrior_back'].clone();
	}
	ret.bigImage = window.blassets['warrior_big'].clone();
	ret.image.dude = ret;
	
	return ret;
}

bl.knight = function(player, row, col) {
	var ret = new bl.dude(player, row, col);
	ret.speed  = 1;
	ret.range  = 1;
	ret.power  = 4;
	ret.health = 32;
	ret.type = 'knight';

	if(ret.owner == 0) {
		ret.image = window.blassets['knight_front'].clone();
	} else {
		ret.image = window.blassets['knight_back'].clone();
	}
	ret.bigImage = window.blassets['knight_big'].clone();
	ret.image.dude = ret;
	
	return ret;
}

bl.dude_move_radius = function(dude) {
	var j = 0;
	var radius = new Array();

	for (r = 0; r < 13; r++) {
		rowd = Math.abs(r - dude.row);
		for (c = 0; c < 13; c++) {
			cold = Math.abs(c - dude.col);
			if (rowd + cold <= dude.speed) {
				radius[j] = new Object();
				radius[j].x = r;
				radius[j].y = c;
				j++;
			}
		}
	}
	return radius;
}

bl.dude_fight_radius = function(dude) {
	var j = 0;
	var radius = new Array();

	for (r = 0; r < 13; r++) {
		rowd = Math.abs(r - dude.row);
		for (c = 0; c < 13; c++) {
			cold = Math.abs(c - dude.col);
			if (rowd + cold <= dude.range) {
				radius[j] = new Object();
				radius[j].x = r;
				radius[j].y = c;
				j++;
			}
		}
	}
	return radius;
}

bl.dude_kill = function(dude) {
	dude.health = 0;
}

bl.dudes_alive = function(player) {
	var d, count = 0;
	for (var i = 0; i < window.dude.length(); i++) {
		d = window.dude[i];
		if (d.owner == player && d.health > 0) {
			count++;
		}
	}
	return count;
}

bl.dude_init();
