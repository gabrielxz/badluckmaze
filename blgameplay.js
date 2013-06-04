bl.GameStatus = 'CharSelection';
bl.CurrPlayer = 0;
		
bl.onGridClick = function(ev)
{
	var ch, dude, squares;

	ch = bl.getChar(ev.target);
	if(ch != null)
	{
		dude = ch.dude;

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
			dude = ev.target.origin;
			if (ev.target.validMove)
			{
				addChar(dude.image, ev.target.parent);
				dudes.move(dude, ev.target.row, ev.target.col);
			}
			else if (ev.target.validAttack)
			{
				dudes.attack(dude);
				bl.StartFight(dude, bl.getChar(ev.target).dude);
			}
		case 'CharSelection':
			clearAll();
			dudes.update(bl.CurrPlayer);
			dudes.update(bl.otherPlayer());
			window.maze.stage.update();
			if (bl.hasActiveChar(ev.target))
			{
				dude = bl.getChar(ev.target).dude;
				squares = dudes.valid_moves(dude);
				setHighlights(squares, 'move', dude);
				squares = dudes.valid_attacks(dude);
				setHighlights(squares, 'target', dude);
				bl.GameStatus = 'CharSelected';
			}
			else
			{
			    bl.GameStatus = 'CharSelection';
			}
			break;
	}
	window.maze.stage.update();
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
	clearAll();
	dudes.update(bl.CurrPlayer);
	dudes.update(bl.otherPlayer());
	totems.check();
	window.maze.stage.update();
}

bl.hasActiveChar = function(square)
{
	var ch = bl.getChar(square);
	if (ch == null)
		return false;
	if (ch.dude.owner == bl.CurrPlayer)
		return true;
	return false;
}

bl.hasEnemyChar = function(square)
{
	var ch = bl.getChar(square);
	if (ch == null)
		return false;
	if (ch.dude.owner != bl.CurrPlayer)
		return true;
	return false;
}

bl.getChar = function(square)
{
	var ch = square.parent.getChildByName('char');
	if (ch == null)
		return null;
	if (ch.getNumChildren() < 1)
		return null;
	ch = ch.getChildAt(0);
	return ch;
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
