window.blassets['die_0']   = new createjs.Bitmap('assets/dice/die_0.png');
window.blassets['die_1']   = new createjs.Bitmap('assets/dice/die_1.png');
window.blassets['die_2']   = new createjs.Bitmap('assets/dice/die_2.png');
window.blassets['die_2-1'] = new createjs.Bitmap('assets/dice/die_2-1.png');
window.blassets['die_3']   = new createjs.Bitmap('assets/dice/die_3.png');
window.blassets['die_3-1'] = new createjs.Bitmap('assets/dice/die_3-1.png');
window.blassets['die_3-2'] = new createjs.Bitmap('assets/dice/die_3-2.png');
window.blassets['die_4']   = new createjs.Bitmap('assets/dice/die_4.png');
window.blassets['die_4-1'] = new createjs.Bitmap('assets/dice/die_4-1.png');
window.blassets['die_4-2'] = new createjs.Bitmap('assets/dice/die_4-2.png');
window.blassets['die_4-3'] = new createjs.Bitmap('assets/dice/die_4-3.png');
window.blassets['die_5']   = new createjs.Bitmap('assets/dice/die_5.png');
window.blassets['die_5-1'] = new createjs.Bitmap('assets/dice/die_5-1.png');
window.blassets['die_5-2'] = new createjs.Bitmap('assets/dice/die_5-2.png');
window.blassets['die_5-3'] = new createjs.Bitmap('assets/dice/die_5-3.png');
window.blassets['die_5-4'] = new createjs.Bitmap('assets/dice/die_5-4.png');
window.blassets['die_6']   = new createjs.Bitmap('assets/dice/die_6.png');
window.blassets['die_6-1'] = new createjs.Bitmap('assets/dice/die_6-1.png');
window.blassets['die_6-2'] = new createjs.Bitmap('assets/dice/die_6-2.png');
window.blassets['die_6-3'] = new createjs.Bitmap('assets/dice/die_6-3.png');
window.blassets['die_6-4'] = new createjs.Bitmap('assets/dice/die_6-4.png');
window.blassets['die_6-5'] = new createjs.Bitmap('assets/dice/die_6-5.png');

bl.dice_result = function() {
	this.imgarr = new Array();
	this.imgarr[0] = new Array();
	this.imgarr[0][0] = window.blassets['die_1'].clone();
	this.imgarr[0][1] = window.blassets['die_0'].clone();
	this.imgarr[1] = new Array();
	this.imgarr[1][0] = window.blassets['die_2'].clone();
	this.imgarr[1][1] = window.blassets['die_2-1'].clone();
	this.imgarr[1][2] = this.imgarr[0][1];
	this.imgarr[2] = new Array();
	this.imgarr[2][0] = window.blassets['die_3'].clone();
	this.imgarr[2][1] = window.blassets['die_3-1'].clone();
	this.imgarr[2][2] = window.blassets['die_3-2'].clone();
	this.imgarr[2][3] = this.imgarr[0][1];
	this.imgarr[3] = new Array();
	this.imgarr[3][0] = window.blassets['die_4'].clone();
	this.imgarr[3][1] = window.blassets['die_4-1'].clone();
	this.imgarr[3][2] = window.blassets['die_4-2'].clone();
	this.imgarr[3][3] = window.blassets['die_4-3'].clone();
	this.imgarr[3][4] = this.imgarr[0][1];
	this.imgarr[4] = new Array();
	this.imgarr[4][0] = window.blassets['die_5'].clone();
	this.imgarr[4][1] = window.blassets['die_5-1'].clone();
	this.imgarr[4][2] = window.blassets['die_5-2'].clone();
	this.imgarr[4][3] = window.blassets['die_5-3'].clone();
	this.imgarr[4][4] = window.blassets['die_5-4'].clone();
	this.imgarr[4][5] = this.imgarr[0][1];
	this.imgarr[5] = new Array();
	this.imgarr[5][0] = window.blassets['die_6'].clone();
	this.imgarr[5][1] = window.blassets['die_6-1'].clone();
	this.imgarr[5][2] = window.blassets['die_6-2'].clone();
	this.imgarr[5][3] = window.blassets['die_6-3'].clone();
	this.imgarr[5][4] = window.blassets['die_6-4'].clone();
	this.imgarr[5][5] = window.blassets['die_6-5'].clone();
	this.imgarr[5][6] = this.imgarr[0][1];
	this.image = this.imgarr[0][0];
}

bl.dice_init = function() {
	window.dice = new Object();
	window.dice.missing = new Array();
	window.dice.results = new Array(); 

	for (var i = 0; i < 24; i++) {
		window.dice.missing.push(0);
	}

	for (var i = 0; i < 4; i++) {
		window.dice.results.push(new bl.dice_result());
	}
}

bl.dice_rand = function(max) {
	return Math.floor(Math.random() * max);
}

bl.dice_i_to_p = function(i) {
	return Math.floor(i/12);
}

bl.dice_i_to_missing = function(i) {
	return window.dice.missing[i];
}

bl.dice_i_to_base_val = function(i) {
	return (i % 6) + 1;
}

bl.dice_i_to_curr_val = function(i) {
	return bl.dice_i_to_base_val(i) - bl.dice_i_to_missing();
}

bl.dice_pds_to_i = function(player, die, side) {
	return (player * 12) + (die * 6) + side;
}

bl.dice_ps_to_i = function(player, side) {
	return (player * 12) + side;
}

bl.dice_lose_pip = function(player) {
	var i, side;
	do {
		side = bl.dice_rand(12);
		i = bl.dice_ps_to_i(player, side);
	} while(bl.dice_i_to_curr_val(i) == 0);

	window.dice.missing[i]++;
}

bl.dice_gain_pip = function(player) {
	var i;
	var r = 0;
	var removed = new Array();

	for(i = 0; i < 24; i++) {
		removed[r] = i;
	}

	// Fixme
	if(removed.length = 0) {
		return;
	}

	r = bl.dice_rand(r);
	i = removed[r];
	window.dice.missing[i]--;
}

bl.dice_roll = function(player, die) {
	var i, ri, base, missing;

	ri = (player * 2) + die;
	i = bl.dice_pds_to_i(player, 0, bl.dice_rand(6));
	base = bl.dice_i_to_base_val(i);
	missing = bl.dice_i_to_missing(i);
	img = window.dice.results[ri].imgarr[base-1][missing];
	window.dice.results[ri].image = img;
	return base - missing;
}

bl.dice_init();
