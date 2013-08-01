media = new Object();
mediaPriv = new Object();

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PUBLIC ACCESSORS -- //////////////////////////
//////////////////////////////////////////////////////////////////////////// 

media.get_background_img = function() {
	return mediaPriv.images['Background'].clone();
}

media.get_dude_img = function(type, player) {
	var id = mediaPriv.dude_id(type, player);
	var img = mediaPriv.images[id].clone();

	//img.x = 0 - Math.floor(img.image.width / 2);
	//img.y = 0 - img.image.height;

	// FIXME: Hack because image might not be loaded yet
	img.x = -27;
	img.y = -100;
	return img;
}

media.get_portrait_img = function(type) {
	var id = mediaPriv.portrait_id(type);
	var img = mediaPriv.images[id].clone();
	return img;
}

// Eventualy take row,col and return a specific image rotated correctly
media.get_totem_img = function(type, player) {
	if(type != 'Pit') {
		type = 'Totem';
	}
	var id = mediaPriv.totem_id(type, player);
	var img = mediaPriv.images[id].clone();

	//img.x = 0 - Math.floor(img.image.width / 2);
	//img.y = 10 - img.image.height;

	// FIXME: Hack because image might not be loaded yet
	img.x = -70;
	img.y = -110;

	// FIXME: Change the png files so this is unnecessary
	if(type == 'Pit') {
		img.y += 10;

		// FIXME: Hack because image might not be loaded yet
		img.x = -68;
	}
	return img;
}

media.get_die_img = function(base, missing) {
	var id = mediaPriv.die_id(base, missing);
	var img = mediaPriv.images[id].clone();
	return img;
}

// FIXME: What are a & b? Caller probably shouldn't need to pass those.
media.play_sound = function(name, a, b) {
	createjs.Sound.play(name, createjs.Sound.INTERRUPT_NONE, 0, a, 0, b, 0);
}

//////////////////////////////////////////////////////////////////////////// 
////////////////////////// -- PRIVATE FUNCTIONS -- /////////////////////////
//////////////////////////////////////////////////////////////////////////// 

mediaPriv.dude_id = function(type, player) {
	return "Dude-"+type+"-"+player;
}

mediaPriv.portrait_id = function(type, player) {
	return "Portrait-"+type;
}

mediaPriv.totem_id = function(type, player) {
	return "Totem-"+type+"-"+player;
}

mediaPriv.die_id = function(base, missing) {
	return "Die-"+base+"-"+missing;
}

mediaPriv.load_dude_img = function(type, player) {
	var filename = type+mediaPriv.player_map[player];
	mediaPriv.load_img(mediaPriv.dude_id(type, player), filename);
}

mediaPriv.load_portrait_img = function(type) {
	var filename = type+"_big";
	mediaPriv.load_img(mediaPriv.portrait_id(type), filename);
}

mediaPriv.load_totem_img = function(type, player) {
	var filename = type+mediaPriv.player_map[player];
	mediaPriv.load_img(mediaPriv.totem_id(type, player), filename);
}

mediaPriv.load_die_img = function(base, missing) {
	var filename = "die_";
	if(base - missing <= 0) {
		filename += '0';
	} else {
		filename += base;
		if(missing > 0) {
			filename += '-' + missing;
		}
	}

	mediaPriv.load_img(mediaPriv.die_id(base, missing), "dice/"+filename);
}

mediaPriv.load_img = function(id, filename) {
	mediaPriv.images[id] = new createjs.Bitmap('assets/'+filename+'.png');
}

mediaPriv.done_loading = function() {
	//media.play_sound("mainGameMusic", 10000, 0.1);
}


//////////////////////////////////////////////////////////////////////////// 
/////////////////////////// -- INITIALIZATION -- ///////////////////////////
//////////////////////////////////////////////////////////////////////////// 

media.init = function() {
	var manifest = new Array();
	var side, base, missing;

	mediaPriv.player_map = new Array();
	mediaPriv.player_map[RED_PLAYER]  = '_red';
	mediaPriv.player_map[BLUE_PLAYER] = '_blue';
	mediaPriv.player_map[NO_PLAYER]   = '_none';

	mediaPriv.images = new Array();

	// Background
	mediaPriv.load_img('Background', 'board');

	// Dudes
	mediaPriv.load_dude_img('Archer',  RED_PLAYER);
	mediaPriv.load_dude_img('Archer',  BLUE_PLAYER);
	mediaPriv.load_dude_img('Rogue',   RED_PLAYER);
	mediaPriv.load_dude_img('Rogue',   BLUE_PLAYER);
	mediaPriv.load_dude_img('Warrior', RED_PLAYER);
	mediaPriv.load_dude_img('Warrior', BLUE_PLAYER);

	// Portraits
	mediaPriv.load_portrait_img('Archer');
	mediaPriv.load_portrait_img('Rogue');
	mediaPriv.load_portrait_img('Warrior');

	// Totems
	mediaPriv.load_totem_img('Totem', RED_PLAYER);
	mediaPriv.load_totem_img('Totem', BLUE_PLAYER);
	mediaPriv.load_totem_img('Totem', NO_PLAYER);
	mediaPriv.load_totem_img('Pit',   RED_PLAYER);
	mediaPriv.load_totem_img('Pit',   BLUE_PLAYER);
	mediaPriv.load_totem_img('Pit',   NO_PLAYER);

	// Dice
	for(var side = 0; side < NUM_SIDES_PER_DIE; side++) {
		base = side + 1;
		for(var missing = 0; missing <= base; missing++) {
			mediaPriv.load_die_img(base, missing);
		}
	}

	// FIXME: Should we use preload to get all the images too?
	manifest = [
		{id:'movement',             src:'assets/movement.mp3'},
		{id:'mainGameMusic',        src:'assets/mainGameMusic.mp3'},
		{id:'archerAttack',         src:'assets/archerAttack2.mp3'},
		{id:'blueWins',             src:'assets/blueWins.mp3'},
		{id:'death',                src:'assets/deathScream.mp3'},
		{id:'diceRoll',             src:'assets/diceRoll.mp3'},
		{id:'fightPopupTransition', src:'assets/fightPopupTransition.mp3'},
		{id:'morrighanTotem',       src:'assets/morrighanTotem.mp3'},
		{id:'nomofo',               src:'assets/nomofo.mp3'},
		{id:'redWins',              src:'assets/redWins.mp3'},
		{id:'splashPageMusic',      src:'assets/splashPageMusic.mp3'},
		{id:'rogueAttack',          src:'assets/rogueAttack.mp3'},
		{id:'warriorAttack',        src:'assets/warriorAttack.mp3'}
	];
	preload = new createjs.LoadQueue();
	preload.installPlugin(createjs.Sound);
	preload.addEventListener("complete", mediaPriv.done_loading);
	preload.loadManifest(manifest);
}

