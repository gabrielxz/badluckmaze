window.blassets['die_0']   = new createjs.Bitmap('assets/die_0.png');
window.blassets['die_1']   = new createjs.Bitmap('assets/die_1.png');
window.blassets['die_2']   = new createjs.Bitmap('assets/die_2.png');
window.blassets['die_2-1'] = new createjs.Bitmap('assets/die_2-1.png');
window.blassets['die_3']   = new createjs.Bitmap('assets/die_3.png');
window.blassets['die_3-1'] = new createjs.Bitmap('assets/die_3-1.png');
window.blassets['die_3-2'] = new createjs.Bitmap('assets/die_3-2.png');
window.blassets['die_4']   = new createjs.Bitmap('assets/die_4.png');
window.blassets['die_4-1'] = new createjs.Bitmap('assets/die_4-1.png');
window.blassets['die_4-2'] = new createjs.Bitmap('assets/die_4-2.png');
window.blassets['die_4-3'] = new createjs.Bitmap('assets/die_4-3.png');
window.blassets['die_5']   = new createjs.Bitmap('assets/die_5.png');
window.blassets['die_5-1'] = new createjs.Bitmap('assets/die_5-1.png');
window.blassets['die_5-2'] = new createjs.Bitmap('assets/die_5-2.png');
window.blassets['die_5-3'] = new createjs.Bitmap('assets/die_5-3.png');
window.blassets['die_5-4'] = new createjs.Bitmap('assets/die_5-4.png');
window.blassets['die_6']   = new createjs.Bitmap('assets/die_6.png');
window.blassets['die_6-1'] = new createjs.Bitmap('assets/die_6-1.png');
window.blassets['die_6-2'] = new createjs.Bitmap('assets/die_6-2.png');
window.blassets['die_6-3'] = new createjs.Bitmap('assets/die_6-3.png');
window.blassets['die_6-4'] = new createjs.Bitmap('assets/die_6-4.png');
window.blassets['die_6-5'] = new createjs.Bitmap('assets/die_6-5.png');

function
dice_image() {
	this.side[0] = new Array();
	this.side[0][0] = window.blassets['die_1'].clone;
	this.side[0][1] = window.blassets['die_0'].clone;
	this.side[1] = new Array();
	this.side[1][0] = window.blassets['die_2'].clone;
	this.side[1][1] = window.blassets['die_2-1'].clone;
	this.side[1][2] = this.side[0][1];
	this.side[2] = new Array();
	this.side[2][0] = window.blassets['die_3'].clone;
	this.side[2][1] = window.blassets['die_3-1'].clone;
	this.side[2][2] = window.blassets['die_3-2'].clone;
	this.side[2][3] = this.side[0][1];
	this.side[3] = new Array();
	this.side[3][0] = window.blassets['die_4'].clone;
	this.side[3][1] = window.blassets['die_4-1'].clone;
	this.side[3][2] = window.blassets['die_4-2'].clone;
	this.side[3][3] = window.blassets['die_4-3'].clone;
	this.side[3][4] = this.side[0][1];
	this.side[4] = new Array();
	this.side[4][0] = window.blassets['die_5'].clone;
	this.side[4][1] = window.blassets['die_5-1'].clone;
	this.side[4][2] = window.blassets['die_5-2'].clone;
	this.side[4][3] = window.blassets['die_5-3'].clone;
	this.side[4][4] = window.blassets['die_5-4'].clone;
	this.side[4][5] = this.side[0][1];
	this.side[5] = new Array();
	this.side[5][0] = window.blassets['die_6'].clone;
	this.side[5][1] = window.blassets['die_6-1'].clone;
	this.side[5][2] = window.blassets['die_6-2'].clone;
	this.side[5][3] = window.blassets['die_6-3'].clone;
	this.side[5][4] = window.blassets['die_6-4'].clone;
	this.side[5][5] = window.blassets['die_6-5'].clone;
	this.side[5][6] = this.side[0][1];
}

function
dice_init() {
	window.dice = new Object();
	window.dice.missing = new Array();
	window.dice.roll = new Array(); 
	window.dice.images = new Array();

	for (var i = 0; i < 24; i++) {
		window.dice.missing.push(0);
	}

	for (var i = 0; i < 2; i++) {
		window.dice.roll.push(null);
	}

	for (var d = 0; d < 4; d++) {
		window.dice.images.push(new dice_image());
	}
}

function
dice_rand(max) {
	return Math.floor(Math.random() * max);
}

function
dice_i_to_p(i) {
	return Math.floor(i/12);
}

function
dice_i_to_missing(i) {
	return window.dice.missing[i];
}

function
dice_i_to_base_val(i) {
	return (i % 6) + 1;
}

function
dice_i_to_curr_val(i) {
	return dice_i_to_base_val(i) - dice_i_to_missing();
}

function 
dice_pds_to_i(player, die, side) {
	return (player * 12) + (die * 6) + side;
}

function
dice_ps_to_i(player, side) {
	return (player * 12) + side;
}

function
dice_lose_pip(player) {
	var i, side;
	do {
		side = dice_rand(12);
		i = dice_ps_to_i(player, side);
	} while(dice_i_to_curr_val(i) == 0);

	window.dice.missing[i]++;
}

function
dice_gain_pip(player) {
	var i;
	var r = 0;
	var removed = new Array();

	for(i = 0; i < 24; i++) {
		removed[r] = i;
	}

	r = dice_rand(r);
	i = removed[r];
	window.dice.missing[i]--;
}

function
dice_roll(player) {
	var roll_0, roll_1;
	roll_0 = dice_pds_to_i(player, 0, dice_rand(6));
	roll_1 = dice_pds_to_i(player, 1, dice_rand(6));
	window.dice.roll[0] = roll_0;
	window.dice.roll[1] = roll_1;
	return dice_i_to_curr_val(roll_0) + dice_i_to_curr_val(roll_1);
}

function
dice_image_of_last_roll(die) {
	var base = dice_i_to_base_val(window.dice.roll[die]);
	var missing = dice_i_to_missing(window.dice.roll[die]);
	return window.dice.images.side[base][missing];
}

