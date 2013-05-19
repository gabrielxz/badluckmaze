
bl.fight_init = function() {
	window.fight = new Object();
	window.fight.offense_roll = 0;
	window.fight.defense_roll = 0;
	window.fight.damage = 0;
}

bl.fight = function(attacker, defender) {
	var offense, defense, damage;

	offense = bl.dice_roll(attacker.owner, 0);
	offense += bl.dice_roll(attacker.owner, 1);

	defense = bl.dice_roll(defender.owner, 0);
	defense += bl.dice_roll(defender.owner, 1);

	damage = offense + attacker.power - defense;
	if (damage < 0) {
		damage = 0;
	}

	defender.health -= damage;
	if (defender.health <= 0) {
		bl.dude_kill(defender);
	}

	window.fight.offense_roll = offense;
	window.fight.defense_roll = defense;
	window.fight.damage  = damage;
}

bl.StartFight(attacker, defender)
{
	
}

bl.fight_init();
