
bl.fight = function(attacker, defender) {
	offense = bl.dice_roll(attacker.owner, 0);
	offense += bl.dice_roll(attacker.owner, 1);

	defense = bl.dice_roll(defender.owner, 0);
	defense += bl.dice_roll(defender.owner, 1);

	damage = offense + attacker.power - defense;
	if (damage < 0) {
		damage = 0;
	}

	defender.health -= damage;
}

