
bl.fight = function(attacker, defender) {
	offense = dice_roll(attacker.owner);
	die_0[attacker.owner] = dice_image_of_last_roll(0);
	die_1[attacker.owner] = dice_image_of_last_roll(1);

	defense = dice_roll(defender.owner);
	die_0[defender.owner] = dice_image_of_last_roll(0);
	die_1[defender.owner] = dice_image_of_last_roll(1);

	damage = offense + attacker.power - defense;
	if (damage < 0) {
		damage = 0;
	}

	defender.health -= damage;
}

