window.dice = new Object();

function
init_dice() {
	window.dice.missing = new Array();
	window.dice.roll = new Array(); 

	for (var i = 0; i < 24; i++) {
		window.dice.missing[i] = 0;
	}

	for (var i = 0; i < 2; i++) {
		window.dice.roll[i] = 999;
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

function
dice_lose_dot(player) {
	var i, side;
	do {
		side = dice_rand(12);
		i = dice_ps_to_i(player, side);
	} while(dice_i_to_curr_val(i) == 0);

	window.dice.missing[i]++;
}

function
dice_gain_dot(player) {
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
dice_last_base_val(die) {
	return dice_i_to_base_val(window.dice.roll[die]);
}

function
dice_last_missing(die) {
	return dice_i_to_missing(window.dice.roll[die]);
}
