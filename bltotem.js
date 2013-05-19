window.blassets['totem_dark'] = new createjs.Bitmap('assets/totem.png');
window.blassets['totem_red'] = new createjs.Bitmap('assets/totemred.png');
window.blassets['totem_blue'] = new createjs.Bitmap('assets/totemblue.png');
window.blassets['center_dark'] = new createjs.Bitmap('assets/centerPic.png');
window.blassets['center_red'] = new createjs.Bitmap('assets/centerred.png');
window.blassets['center_blue'] = new createjs.Bitmap('assets/centerblue.png');

bl.totem = function(row, col, bl, gl) {
	this.owner = null;
	this.row   = row;
	this.col   = col;
	this.bl    = bl;
	this.gl    = gl;

	if(row == 6 && col == 6) {
		this.center = true;
		this.image_dark = window.blassets['center_dark'].clone();
		this.image_red  = window.blassets['center_red'].clone();
		this.image_blue = window.blassets['center_blue'].clone();
	} else {
		this.center = false;
		this.image_dark = window.blassets['totem_dark'].clone();
		this.image_red  = window.blassets['totem_red'].clone();
		this.image_blue = window.blassets['totem_blue'].clone();
	}
	this.image = this.image_dark;
}

bl.totem_init = function() {
	window.totem = new Array();
	window.totem.push(new bl.totem(4,  2, 2, 0));
	window.totem.push(new bl.totem(8,  2, 2, 0));
	window.totem.push(new bl.totem(11, 5, 4, 0));
	window.totem.push(new bl.totem(1,  7, 4, 0));
	window.totem.push(new bl.totem(4, 10, 2, 0));
	window.totem.push(new bl.totem(8, 10, 2, 0));
	window.totem.push(new bl.totem(6,  6, 4, 4));
}

bl.totem_hit = function(dude, totem) {
	var newOwner = dude.owner;

	if(toten.center) {
		console.log("Center owner: "+totem.owner);
	}
	if(newOwner == totem.owner) {
		return;
	}

	// Return pips
	if(totem.owner != null) {
		for(var i = 0; i < totem.bl; i++) {
			bl.dice_gain_pip(newOwner);
		}
		for(var i = 0; i < totem.gl; i++) {
			bl.dice_lose_pip(totem.owner);
		}
	}

	// Take pips
	for(var i = 0; i < totem.gl; i++) {
		bl.dice_gain_pip(newOwner);
	}
	for(var i = 0; i < totem.bl; i++) {
		bl.dice_lose_pip(bl.otherPlayer(newOwner));
	}

	totem.owner = newOwner;
	
	if(totem.owner == 0) {
		totem.image = totem.image_red;
	} else if (totem.owner == 1) {
		totem.image = totem.image_blue;
	} else {
		totem.image = totem.image_dark;
	}

	if(totem.center) {
		console.log("Kill");
		bl.dude_kill(dude);
	}
}

bl.addTotems = function()
{
	for (var x in window.totem)
	{
		bl.addTotem(totem[x].image,window.maze.board[totem[x].row][totem[x].col], window.totem[x].center);
	}
}

bl.updateTotems = function()
{
	for (var x in window.totem)
	{
		console.log("Totem: "+window.totem[x].row+", "+window.totem[x].col);
		var square = window.maze.board[window.totem[x].row][window.totem[x].col];
		if (bl.hasActiveChar(square))
		{
			console.log("Hit");
			square.misc.removeAllChildren();
			var ch = bl.getChar(square);
			bl.totem_hit(ch.dude, window.totem[x]);
			bl.addTotem(window.totem[x].image, square, window.totem[x].center);
		}
	}
}

bl.addTotem = function(ca, square, isCenter)
{
	var misc = square.getChildByName('misc');
	ca.x = 0 - Math.floor(ca.image.width/2);
	ca.y = (isCenter ? 25 : 10) - ca.image.height;
	misc.addChild(ca);
	return true;
}

bl.totem_check = function(dude) {
	for (var i = 0; i < window.totem.length; i++) {
		if(dude.row == window.totem[i].row &&
		   dude.col == window.totem[i].col) {
			bl.totem_hit(dude, window.totem[i]);
		}
	}
}

bl.totem_init();
