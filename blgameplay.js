bl.GameStatus = 'CharSelection';
bl.CurrPlayer = 0;
bl.selected_dude = null;

bl.select = function(row, col, dude, attack_target, move_target)
{
	if(dude != null)
	{
		// set top left text objects with dude info
		console.log("Selected dude's stats...");
		console.log("health: "+dude.health);
		console.log("power: "+dude.power);
		console.log("speed: "+dude.speed);
		console.log("range: "+dude.range);
	}

	switch(bl.GameStatus)
	{
		case 'CharSelected':
			if(move_target)
			{
				dudes.move(bl.selected_dude, row, col);
			}
			else if(attack_target)
			{
				dudes.attack(dude);
				bl.StartFight(bl.selected_dude, dude);
			}
		case 'CharSelection':
			board.clear();
			stage.update();
			if(dude && dude.owner == bl.CurrPlayer)
			{
				board.highlight('green', dudes.valid_moves(dude));
				board.highlight('red', dudes.valid_attacks(dude));
				bl.selected_dude = dude;
				bl.GameStatus = 'CharSelected';
			}
			else
			{
				bl.GameStatus = 'CharSelection';
			}
			break;
	}
	stage.update();
}

bl.otherPlayer = function()
{
	return (bl.CurrPlayer ? 0 : 1);
}

bl.endTurn = function()
{
	dudes.reset_all(bl.CurrPlayer);
	bl.CurrPlayer = bl.otherPlayer();
	bl.GameStatus = 'CharSelection';
	board.clear();
	totems.check();
	stage.update();
}

bl.isDudeActive = function(dude)
{
	return (dude && dude.owner == bl.CurrPlayer);
}

bl.isValidMove = function(row, col)
{
	return (board.get_dude(row, col) == null);
}

bl.isValidAttack = function(row, col)
{
	var dude = board.get_dude(row, col);
	return (dude && !bl.isDudeActive(dude));
}

bl.checkForWin = function()
{
	if (dudes.num_alive(bl.otherPlayer()) <= 0)
	{
		if (bl.CurrPlayer == 0)
		{
			window.location = "http://www.therandomstore.com/redwins.html";
		}
		else
		{
			window.location = "http://www.therandomstore.com/redwins.html";
		}
	}
	
}

bl.turnFinished = function()
{
	if(dudes.num_available(bl.CurrPlayer) > 0) {
		return false;
	}
	return true;
}
