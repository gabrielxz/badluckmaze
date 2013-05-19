bl.GameStatus = 'CharSelection';
bl.CurrPlayer = 0;


bl.validMoves = function(dude, coords) 
{
	var coord, square;
	var valid = Array();

	for (var i in coords)
	{
		coord = coords[i];
		square = window.maze.board[coord.y][coord.x].getChildByName('basegrid');

		if (!bl.getChar(square))
		{
			square.validMove = true;
			valid.push(square);
		}
	}

	if (valid.length() <= 0)
	{
		dude.canMove = false;
	}
	return valid;
}

bl.validAttacks = function(dude, coords) 
{
	var coord, square;
	var valid = Array();

	for (var i in coords)
	{
		coord = coords[i];
		square = window.maze.board[coord.y][coord.x].getChildByName('basegrid');

		if (bl.hasEnemyChar(square))
		{
			square.validAttack = true;
			valid.push(square);
		}
	}

	if (valid.length() <= 0)
	{
		dude.canAttack = false;
	}
	return valid;
}
		
bl.onGridClick = function(ev)
{
	var dude, coords, squares;

	switch(bl.GameStatus)
	{
		case 'CharSelected':
			if (ev.target.validMove)
			{
				dude = ev.target.origin;
				addChar(dude.image, ev.target.parent);
				dude.row = ev.target.row;
				dude.col = ev.target.col;
				dude.canMove = false;
				createjs.Sound.play("movement", createjs.Sound.INTERRUPT_NONE, 0, 1000, 0, 1, 0);
			}
			else if (ev.target.validAttack)
			{
				var damage = bl.fight(ev.target.origin, bl.getChar(ev.target).dude);
				alert('Mortal Kombat!!');
				alert(damage + ' damage dealt!');
				alert('Defender has ' + bl.getChar(ev.target).dude.health);
				ev.target.origin.canMove = false;
				ev.target.origin.canAttack = false;
			}
		case 'CharSelection':
			clearAll();
			bl.updateDudes();
			if (bl.hasActiveChar(ev.target))
			{
				dude = bl.getChar(ev.target).dude;
				if (dude.canMove)
				{
					coords = bl.dude_move_radius(dude);
					squares = bl.validMoves(dude, coords);
					setHighlights(squares, 'move', dude);
				}
				if (dude.canAttack)
				{
					coords = bl.dude_attack_radius(dude);
					squares = bl.validAttacks(dude, coords);
					setHighlights(squares, 'target', dude);
				}
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
	bl.CurrPlayer = bl.otherPlayer();
	bl.GameStatus = 'CharSelection';
	bl.resetDudes();
	clearAll();
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

bl.updateDudes = function()
{
	for(var x in window.dude)
	{
		var d = dude[x];
		addChar(d.image,window.maze.board[d.col][d.row]);
	}
}

bl.resetDudes = function()
{
	for(var x in window.dude)
	{
		var d = dude[x];
		d.canMove = true;
		d.canAttack = true;
	}
}

bl.checkForWin = function()
{
	return (bl.dudes_alive(bl.otherPlayer()) <= 0);
}

