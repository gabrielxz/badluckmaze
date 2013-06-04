RED_PLAYER  = 0;
BLUE_PLAYER = 1;

totems = new Object();
totemsPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- PUBLIC MUTATORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

totems.take = function(totemObj, dude) {
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
	totemsPriv.update_image(totemObj);
}

totems.check = function() {
	var totemObj, layer;

	for(var i in totemsPriv.totems) {
		totemObj = totemsPriv.totems[i];
		layer = totemObj.square.getChildByName('basegrid');

		if (bl.hasActiveChar(layer)) {
			totems.take(totemObj, bl.getChar(layer).dude);
		}
	}
	maze.stage.update();
}

totems.update = function() {
	var totemObj;

	for(var i in totemsPriv.totems) {
		totemObj = totemsPriv.totems[i];
		totemsPriv.update_image(totemObj);
	}
	maze.stage.update();
}

//////////////////////////////////////////////////////////////////////////// 
//////////////////////// -- PRIVATE CONSTRUCTORS -- //////////////////////// 
//////////////////////////////////////////////////////////////////////////// 

totemsPriv.createTotem = function(row, col, type) {
	this.owner    = null;
	this.row      = row;
	this.col      = col;
	this.type     = type;
	this.badLuck  = totemsPriv.badLuck[type];
	this.goodLuck = totemsPriv.goodLuck[type];
	this.square   = maze.board[col][row];

	this.images = new Array();
	this.images[RED_PLAYER]  = blassets[type][RED_PLAYER].clone();
	this.images[BLUE_PLAYER] = blassets[type][BLUE_PLAYER].clone();
	this.images['Dark']      = blassets[type]['Dark'].clone();

	this.image = this.images['Dark'];
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

totemsPriv.update_image = function(totemObj) {
	var img, layer;

	img = totemObj.image;
	layer = totemObj.square.getChildByName('misc');

	img.x = 0 - Math.floor(img.image.width/2);
	img.y = 10 - img.image.height;
	// FIXME: Change the png files so this is unnecessary
	if(totemObj.type == 'Pit') {
		img.y = 25 - img.image.height;
	}

	layer.removeAllChildren();
	layer.addChild(totemObj.image);
}

totemsPriv.init = function() {
	blassets['Minor'] = new Array();
	blassets['Minor'][RED_PLAYER] = new createjs.Bitmap('assets/totemRed.png') ;
	blassets['Minor'][BLUE_PLAYER] = new createjs.Bitmap('assets/totemBlue.png') ;
	blassets['Minor']['Dark'] = new createjs.Bitmap('assets/totem.png') ;
	blassets['Major'] = new Array();
	blassets['Major'][RED_PLAYER] = new createjs.Bitmap('assets/totemRed.png') ;
	blassets['Major'][BLUE_PLAYER] = new createjs.Bitmap('assets/totemBlue.png') ;
	blassets['Major']['Dark'] = new createjs.Bitmap('assets/totem.png') ;
	blassets['Pit'] = new Array();
	blassets['Pit'][RED_PLAYER] = new createjs.Bitmap('assets/centerred.png') ;
	blassets['Pit'][BLUE_PLAYER] = new createjs.Bitmap('assets/centerblue.png') ;
	blassets['Pit']['Dark'] = new createjs.Bitmap('assets/centerPic.png') ;

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

totemsPriv.init();
