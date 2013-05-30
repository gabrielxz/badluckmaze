
bl.fight_init = function() {
	window.fight = new Object();
	window.fight.offense_roll = 0;
	window.fight.defense_roll = 0;
	window.fight.damage = 0;
}

bl.fight = function(attacker, defender) {
	var offense, defense, damage;

	dice.roll_dice(attacker.owner);
	offense = dice.get_result_val(attacker.owner);

	dice.roll_dice(defender.owner);
	defense = dice.get_result_val(defender.owner);

	damage = offense + attacker.power - defense;
	if (damage < 0) {
		damage = 0;
	}

	dudes.wound(defender, damage);

	window.fight.offense_roll = offense;
	window.fight.defense_roll = defense;
	window.fight.damage  = damage;
}

bl.StartFight = function(attacker, defender)
{
	var fs = window.maze.fightpage;
	var square;
	var p1, p2;
	window.maze.modal.alpha = 1;
	fs.alpha = 1;
	
	fs.removeChildAt(1,2);
	fs.attacker = attacker;
	fs.defender = defender;
	
	if (attacker.owner == 0)
	{
		p1 = attacker;
		p2 = defender;
	}
	else
	{
		p1 = defender;
		p2 = attacker;
	}
	
	//player 2 portrait
	square = p1.bigImage.clone();
	square.x = 660;
	square.y = 70;
	square.alpha = 1;
	fs.addChildAt(square, 1);
	
	//player 1 portrait
	square = p2.bigImage.clone();
	square.x = 40;
	square.y = 70;
	square.alpha = 1;
	fs.addChild(square, 1);

	fs.getChildByName('attacker').text = (attacker.owner ? 'Blue' : 'Red') + ' ' + attacker.type;
	fs.getChildByName('damageDealt').text = '';
	fs.getChildByName('p1name').text = 'Blue ' + p2.type;
	fs.getChildByName('p1hp').text = p2.health + ' HP';
	fs.getChildByName('p2name').text = 'Red ' + p1.type;
	fs.getChildByName('p2hp').text = p1.health + ' HP';
	fs.getChildByName('p1stats').text = (p2 == attacker ? '+' + p2.power + ' Power' : '');
	fs.getChildByName('p2stats').text = (p1 == attacker ? '+' + p1.power + ' Power' : '');

	fs.getChildByName('button').text = 'Roll';

	bl.GameStatus = 'FightStarted';

	fs.getStage().update();
}

bl.onFightClick = function(ev)
{
	var fs = window.maze.fightpage;
	var p1, p2;

	if (fs.attacker.owner == 0)
	{
		p1 = fs.attacker;
		p2 = fs.defender;
	}
	else
	{
		p1 = fs.defender;
		p2 = fs.attacker;
	}

	switch (bl.GameStatus)
	{
		case 'FightStarted':
			fs.getChildByName('button').text = 'Close';
			bl.fight(fs.attacker,fs.defender);
			fs.getChildByName('damageDealt').text = window.fight.damage + ' Damage!';
			setFightDice(dice.get_result_img(0, 0), dice.get_result_img(0, 1), 
			             dice.get_result_img(1, 0), dice.get_result_img(1, 1));
			fs.getChildByName('p1hp').text = p2.health + ' HP';
			fs.getChildByName('p2hp').text = p1.health + ' HP';

			bl.GameStatus = 'FightResolved';
			break;
		case 'FightResolved':
			window.maze.modal.alpha = 0;
			bl.GameStatus = 'CharSelection';
			break;
	}
	window.maze.stage.update();
}

bl.fight_init();
